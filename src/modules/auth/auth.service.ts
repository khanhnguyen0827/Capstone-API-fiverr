import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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
    const { email, password, ho_ten, phone, birth_day, gender, role, skill, certification, anh_dai_dien } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const user = await this.prisma.users.create({
      data: {
        email,
        pass_word: hashedPassword,
        ho_ten,
        phone,
        birth_day,
        gender,
        role: role || 'USER', // Default role
        skill,
        certification,
        anh_dai_dien,
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
        created_at: true,
      },
    });

    // Tạo JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

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

    // Tạo JWT token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

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
        role: true,
      },
    });

    return user;
  }
}