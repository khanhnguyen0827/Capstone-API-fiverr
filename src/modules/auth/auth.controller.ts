import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Đăng ký người dùng mới',
    description: 'Tạo tài khoản người dùng mới với email, mật khẩu và thông tin cá nhân'
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Đăng ký thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Đăng ký thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'user',
          skill: 'Lập trình web',
          certification: 'AWS Certified'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ hoặc email đã tồn tại',
    schema: {
      example: {
        statusCode: 400,
        message: 'Email đã tồn tại',
        content: null,
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async signup(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.signup(registerDto);
      return {
        statusCode: 200,
        message: 'Đăng ký thành công',
        content: result,
        dateTime: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          content: null,
          dateTime: new Date().toISOString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('signin')
  @ApiOperation({
    summary: 'Đăng nhập người dùng',
    description: 'Xác thực người dùng và trả về JWT token'
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
            role: 'user',
            skill: 'Lập trình web',
            certification: 'AWS Certified'
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không đúng',
    schema: {
      example: {
        statusCode: 401,
        message: 'Email hoặc mật khẩu không đúng',
        content: null,
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async signin(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.signin(loginDto);
      return {
        statusCode: 200,
        message: 'Đăng nhập thành công',
        content: result,
        dateTime: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: error.message,
          content: null,
          dateTime: new Date().toISOString(),
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
