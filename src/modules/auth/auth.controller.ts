import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký tài khoản mới',
    description: 'Tạo tài khoản người dùng mới với email và mật khẩu'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
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
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiResponse({
    status: 409,
    description: 'Email đã tồn tại'
  })
  async signup(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập với email và mật khẩu để lấy JWT token'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Đăng nhập thành công',
        content: {
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
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          expiresIn: '1d',
          tokenType: 'Bearer'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
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
  async signin(@Body() loginDto: LoginDto) {
    return this.authService.signin(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới JWT token',
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
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          expiresIn: '1d',
          tokenType: 'Bearer'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn'
  })
  async refreshToken() {
    // TODO: Implement refresh token logic
    return {
      statusCode: 200,
      message: 'Làm mới token thành công',
      content: {
        token: 'new-refreshed-token',
        expiresIn: '1d',
        tokenType: 'Bearer'
      },
      dateTime: new Date().toISOString()
    };
  }
}
