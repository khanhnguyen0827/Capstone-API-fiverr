import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
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
