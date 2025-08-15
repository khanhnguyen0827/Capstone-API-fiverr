import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { AuthDto, RegisterDto } from './dto/auth.dto';
import { RESPONSE_MESSAGES, USER_ROLES, SECURITY_CONFIG } from '../../common/constant/app.constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.pass_word))) {
      const { pass_word, ...result } = user;
      return result;
    }
    return null;
  }

  async login(authDto: AuthDto) {
    const user = await this.validateUser(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException(RESPONSE_MESSAGES.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    
    // Generate refresh token
    const refreshPayload = { 
      email: user.email, 
      sub: user.id, 
      type: 'refresh' 
    };
    const refresh_token = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d', // 7 days
    });

    return {
      access_token,
      refresh_token,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.pass_word, SECURITY_CONFIG.bcryptRounds);

    // Create user
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        ...registerDto,
        pass_word: hashedPassword,
        role: registerDto.role || USER_ROLES.USER,
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

    return newUser;
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Get user info
      const user = await this.prisma.nguoiDung.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new access token
      const newPayload = { email: user.email, sub: user.id, role: user.role };
      const access_token = this.jwtService.sign(newPayload);

      // Generate new refresh token
      const refreshPayload = { 
        email: user.email, 
        sub: user.id, 
        type: 'refresh' 
      };
      const new_refresh_token = this.jwtService.sign(refreshPayload, {
        expiresIn: '7d',
      });

      return {
        access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  async logout(userId: number) {
    // TODO: Implement token blacklisting
    // For now, just return success message
    return { message: 'Đăng xuất thành công' };
  }
}
