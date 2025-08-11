import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(registerDto: RegisterDto) {
    const { email, pass_word, ...userData } = registerDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(pass_word, 10);

    // Tạo user mới
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        ...userData,
        email,
        pass_word: hashedPassword,
      },
    });

    // Loại bỏ password khỏi response
    const { pass_word: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async signin(loginDto: LoginDto) {
    const { email, pass_word } = loginDto;

    // Tìm user theo email
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(pass_word, user.pass_word);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token với payload đầy đủ
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Sử dụng JWT service với cấu hình từ module
    const token = this.jwtService.sign(payload);

    // Loại bỏ password khỏi response
    const { pass_word: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
      tokenType: 'Bearer'
    };
  }
}
