import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return this.authService.login(authDto);
  }

  @Post('register')
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
  async register(@Body() registerDto: RegisterDto) {
    // TODO: Implement register logic
    return {
      message: 'Register endpoint - implementation needed',
      data: registerDto
    };
  }
}
