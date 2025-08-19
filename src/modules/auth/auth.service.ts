import { Injectable, UnauthorizedException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerDto.email)) {
        throw new BadRequestException('Email không hợp lệ');
      }

      // Validate password strength
      if (registerDto.pass_word.length < 6) {
        throw new BadRequestException('Mật khẩu phải có ít nhất 6 ký tự');
      }

      // Kiểm tra email đã tồn tại
      const existingUser = await this.prisma.nguoiDung.findUnique({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email đã tồn tại');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(registerDto.pass_word, 12);

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
      const token = this.jwtService.sign(payload, {
        expiresIn: '7d',
        issuer: 'capstone-api',
      });

      this.logger.log(`User registered successfully: ${user.email}`);

      return {
        user,
        access_token: token,
        expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginDto.email)) {
        throw new BadRequestException('Email không hợp lệ');
      }

      // Tìm user theo email
      const user = await this.prisma.nguoiDung.findUnique({
        where: { email: loginDto.email },
      });

      if (!user) {
        this.logger.warn(`Login attempt with non-existent email: ${loginDto.email}`);
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }

      // Kiểm tra password
      const isPasswordValid = await bcrypt.compare(loginDto.pass_word, user.pass_word);
      if (!isPasswordValid) {
        this.logger.warn(`Failed login attempt for user: ${user.email}`);
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }

      // Tạo JWT token
      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload, {
        expiresIn: '7d',
        issuer: 'capstone-api',
      });

      this.logger.log(`User logged in successfully: ${user.email}`);

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
        expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        issuer: 'capstone-api',
      });

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
      this.logger.warn(`Token validation failed: ${error.message}`);
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token đã hết hạn');
      }
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  async refreshToken(userId: number) {
    try {
      const user = await this.prisma.nguoiDung.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload, {
        expiresIn: '7d',
        issuer: 'capstone-api',
      });

      return {
        access_token: token,
        expires_in: 7 * 24 * 60 * 60,
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}