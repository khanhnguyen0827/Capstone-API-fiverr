import { 
  Controller, 
  Post, 
  Body, 
  HttpCode, 
  HttpStatus,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập với email và mật khẩu',
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Đăng nhập thành công',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không đúng',
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Đăng ký',
    description: 'Đăng ký tài khoản mới',
  })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Đăng ký thành công',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiConflictResponse({
    description: 'Email đã được sử dụng',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Làm mới token',
    description: 'Làm mới access token bằng refresh token',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Làm mới token thành công',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token không hợp lệ',
  })
  async refreshToken(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    return await this.authService.refreshToken(userId);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin profile',
    description: 'Lấy thông tin profile của người dùng đang đăng nhập',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Lấy profile thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Token không hợp lệ',
  })
  async getProfile(@Request() req: any) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    const user = await this.authService.validateUser(userId);
    return {
      statusCode: 200,
      message: 'Lấy profile thành công',
      data: user,
    };
  }
}
