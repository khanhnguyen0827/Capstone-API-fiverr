import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, pass_word } = loginDto;

    // Tìm người dùng theo email
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(pass_word, user.pass_word);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT tokens
    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      statusCode: 200,
      message: 'Đăng nhập thành công',
      data: {
        access_token,
        refresh_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, pass_word, ...userData } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(pass_word, 10);

    // Tạo người dùng mới
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        ...userData,
        email,
        pass_word: hashedPassword,
        role: userData.role || 'user',
      },
    });

    // Tạo JWT tokens
    const payload = { 
      userId: newUser.id, 
      email: newUser.email, 
      role: newUser.role 
    };
    
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      statusCode: 201,
      message: 'Đăng ký thành công',
      data: {
        access_token,
        refresh_token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    };
  }

  async refreshToken(userId: number) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      statusCode: 200,
      message: 'Làm mới token thành công',
      data: {
        access_token,
        refresh_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async validateUser(userId: number) {
    return this.prisma.nguoiDung.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }
}
