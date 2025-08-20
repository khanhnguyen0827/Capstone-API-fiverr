import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  Request, 
  HttpCode, 
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
  ApiHeader
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../common/decorators/is-public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { Roles, ROLES } from '../../common/decorators/roles.decorator';
import { BaseResponseDto } from '../../common/dto/base.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @ApiOperation({ 
    summary: 'Đăng ký tài khoản mới',
    description: 'Tạo tài khoản người dùng mới với email và mật khẩu'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Đăng ký thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email đã tồn tại trong hệ thống'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Lỗi validation'
  })
  async register(@Body() registerDto: RegisterDto): Promise<BaseResponseDto> {
    try {
      const result = await this.authService.register(registerDto);
      return {
        message: 'Đăng ký tài khoản thành công',
        data: result,
        status: 'success'
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email đã tồn tại trong hệ thống');
      }
      throw error;
    }
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ 
    summary: 'Đăng nhập vào hệ thống',
    description: 'Xác thực người dùng và trả về JWT token'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng nhập thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Thông tin đăng nhập không chính xác'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Lỗi validation'
  })
  async login(@Body() loginDto: LoginDto): Promise<BaseResponseDto> {
    try {
      const result = await this.authService.login(loginDto);
      return {
        message: 'Đăng nhập thành công',
        data: result,
        status: 'success'
      };
    } catch (error) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Lấy thông tin profile của user hiện tại',
    description: 'Trả về thông tin chi tiết của người dùng đã đăng nhập'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer JWT token',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy profile thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ hoặc đã hết hạn'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền truy cập'
  })
  async getProfile(@CurrentUser() user: any): Promise<BaseResponseDto> {
    const userData = await this.authService.validateUser(user.userId);
    return {
      message: 'Lấy thông tin profile thành công',
      data: userData,
      status: 'success'
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('logout')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Đăng xuất khỏi hệ thống',
    description: 'Vô hiệu hóa token hiện tại'
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer JWT token',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Đăng xuất thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ hoặc đã hết hạn'
  })
  async logout(@CurrentUser() user: any): Promise<BaseResponseDto> {
    // Trong thực tế, có thể blacklist token hoặc xóa session
    await this.authService.logout(user.userId);
    return {
      message: 'Đăng xuất thành công',
      status: 'success'
    };
  }

  @Public()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Làm mới JWT token',
    description: 'Tạo token mới khi token cũ sắp hết hạn'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Làm mới token thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ'
  })
  async refreshToken(@Body() body: { refreshToken: string }): Promise<BaseResponseDto> {
    const result = await this.authService.refreshToken(body.refreshToken);
    return {
      message: 'Làm mới token thành công',
      data: result,
      status: 'success'
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('verify-token')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Xác thực JWT token',
    description: 'Kiểm tra tính hợp lệ của token hiện tại'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Token hợp lệ',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token không hợp lệ'
  })
  async verifyToken(@CurrentUser() user: any): Promise<BaseResponseDto> {
    return {
      message: 'Token hợp lệ',
      data: { userId: user.userId, isValid: true },
      status: 'success'
    };
  }
}