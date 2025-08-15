import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCreatedResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dto/auth.dto';
import { BaseController } from '../../common/base';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập với email và mật khẩu để lấy JWT token'
  })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Đăng nhập thành công',
        content: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'user@example.com',
            phone: '0123456789',
            birth_day: '1990-01-01',
            gender: 'Nam',
            role: 'freelancer',
            skill: 'Thiết kế, Lập trình',
            certification: 'Chứng chỉ thiết kế UI/UX'
          }
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/auth/login',
        method: 'POST'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiResponse({
    status: 401,
    description: 'Email hoặc mật khẩu không đúng'
  })
  async login(@Body() authDto: AuthDto) {
    const result = await this.authService.login(authDto);
    return this.createSuccessResponse(
      result,
      'Đăng nhập thành công'
    );
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description: 'Tạo tài khoản người dùng mới với email và mật khẩu'
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Đăng ký thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Đăng ký thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Thiết kế, Lập trình',
          certification: 'Chứng chỉ thiết kế UI/UX'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/auth/register',
        method: 'POST'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiConflictResponse({
    description: 'Email đã tồn tại'
  })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return this.createCreatedResponse(
      result,
      'Đăng ký thành công'
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới token',
    description: 'Làm mới JWT token khi token cũ hết hạn'
  })
  @ApiResponse({
    status: 200,
    description: 'Làm mới token thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Làm mới token thành công',
        content: {
          access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/auth/refresh',
        method: 'POST'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token không hợp lệ hoặc đã hết hạn'
  })
  async refreshToken(@Body() body: { refresh_token: string }) {
    const result = await this.authService.refreshToken(body.refresh_token);
    return this.createSuccessResponse(
      result,
      'Làm mới token thành công'
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất và vô hiệu hóa token'
  })
  @ApiResponse({
    status: 200,
    description: 'Đăng xuất thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Đăng xuất thành công',
        content: {
          message: 'Đăng xuất thành công'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/auth/logout',
        method: 'POST'
      }
    }
  })
  async logout() {
    // TODO: Implement logout logic (blacklist token)
    return this.createSuccessResponse(
      { message: 'Đăng xuất thành công' },
      'Đăng xuất thành công'
    );
  }
}
