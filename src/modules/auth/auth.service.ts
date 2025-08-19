import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface LoginDto {
  email: string;
  pass_word: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  pass_word: string;
  phone?: string;
  birth_day?: string;
  gender?: string;
  role?: string;
  skill?: string;
  certification?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.pass_word, 10);

    // Tạo user mới
    const user = await this.prisma.nguoiDung.create({
      data: {
        ...registerDto,
        pass_word: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
      },
    });

    // Tạo JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user,
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    // Tìm user theo email
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(loginDto.pass_word, user.pass_word);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birth_day: user.birth_day,
        gender: user.gender,
        role: user.role,
        skill: user.skill,
        certification: user.certification,
      },
      access_token: token,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.nguoiDung.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birth_day: true,
          gender: true,
          role: true,
          skill: true,
          certification: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}