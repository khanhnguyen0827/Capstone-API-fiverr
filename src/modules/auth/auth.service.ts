import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, ho_ten, phone, birth_day, gender, role, skill, certification, anh_dai_dien, is_active } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash password
    const saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS') || '10');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const user = await this.prisma.users.create({
      data: {
        email,
        pass_word: hashedPassword,
        ho_ten,
        phone: phone || null,
        birth_day: birth_day || null,
        gender: gender || null,
        role: role || 'USER',
        skill: skill || null,
        certification: certification || null,
        anh_dai_dien: anh_dai_dien || null,
        is_active: is_active !== undefined ? is_active : true,
      },
      select: {
        id: true,
        email: true,
        ho_ten: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
      },
    });

    // Tạo JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1d',
    });

    return {
      user,
      accessToken,
      message: 'Đăng ký thành công',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user theo email
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.pass_word);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra user có active không
    if (!user.is_active) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    // Tạo JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1d',
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        phone: user.phone,
        birth_day: user.birth_day,
        gender: user.gender,
        role: user.role,
        skill: user.skill,
        certification: user.certification,
        anh_dai_dien: user.anh_dai_dien,
        is_active: user.is_active,
      },
      accessToken,
      message: 'Đăng nhập thành công',
    };
  }

  async validateUser(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        ho_ten: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Người dùng không tồn tại hoặc đã bị khóa');
    }

    return user;
  }

  async logout(userId: number): Promise<void> {
    // Trong thực tế, có thể:
    // 1. Thêm token vào blacklist
    // 2. Cập nhật trạng thái đăng nhập
    // 3. Ghi log đăng xuất
    console.log(`User ${userId} logged out`);
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      // Kiểm tra user có tồn tại và active không
      const user = await this.prisma.users.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          ho_ten: true,
          role: true,
          is_active: true,
        },
      });

      if (!user || !user.is_active) {
        throw new UnauthorizedException('Người dùng không tồn tại hoặc đã bị khóa');
      }

      // Tạo token mới
      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1d',
      });

      return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          ho_ten: user.ho_ten,
          role: user.role,
        },
      };
    } catch (error) {
      throw new BadRequestException('Refresh token không hợp lệ');
    }
  }
}