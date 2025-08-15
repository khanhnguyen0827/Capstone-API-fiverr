import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseController } from '../../common/base';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description: 'Lấy danh sách tất cả người dùng trong hệ thống với phân trang'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách người dùng thành công',
        content: {
          data: [
            {
              id: 1,
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@email.com',
              phone: '0123456789',
              birth_day: '1990-01-01',
              gender: 'Nam',
              role: 'freelancer',
              skill: 'Lập trình web, React, Node.js',
              certification: 'AWS Certified Developer'
            }
          ],
          pagination: {
            page: 1,
            size: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/users',
        method: 'GET'
      }
    }
  })
  async getUsers(
    @Query('page') page?: number,
    @Query('size') size?: number
  ) {
    const { page: validPage, size: validSize } = this.usersService.validatePagination(page, size);
    const result = await this.usersService.getUsers(validPage, validSize);
    
    return this.createPaginatedResponse(
      result.data,
      result.pagination,
      'Lấy danh sách người dùng thành công'
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin người dùng theo ID',
    description: 'Lấy chi tiết thông tin người dùng dựa trên ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin người dùng thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Lập trình web, React, Node.js',
          certification: 'AWS Certified Developer'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/users/1',
        method: 'GET'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Người dùng không tồn tại'
  })
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getUserById(id);
    return this.createSuccessResponse(
      user,
      'Lấy thông tin người dùng thành công'
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo tài khoản người dùng mới (chỉ dành cho admin)'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Tạo người dùng thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo người dùng thành công',
        content: {
          id: 2,
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          phone: '0987654321',
          birth_day: '1995-05-15',
          gender: 'Nữ',
          role: 'client',
          skill: 'Quản lý dự án',
          certification: 'PMP Certified'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/users',
        method: 'POST'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return this.createCreatedResponse(
      user,
      'Tạo người dùng thành công'
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin người dùng (yêu cầu đăng nhập và quyền sở hữu)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID người dùng cần cập nhật',
    type: Number,
    example: 1
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Cập nhật người dùng thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật người dùng thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A (Đã cập nhật)',
          email: 'nguyenvana@email.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Lập trình web, React, Node.js, TypeScript',
          certification: 'AWS Certified Developer, Google Cloud Certified'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/users/1',
        method: 'PUT'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật người dùng này'
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại'
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const user = await this.usersService.updateUser(id, updateUserDto, req.user);
    return this.createUpdatedResponse(
      user,
      'Cập nhật người dùng thành công'
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa người dùng (yêu cầu đăng nhập và quyền admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID người dùng cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa người dùng thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa người dùng thành công',
        content: {
          message: 'Xóa người dùng thành công'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/users/1',
        method: 'DELETE'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa người dùng'
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại'
  })
  async deleteUser(@Param('id') id: number, @Request() req: any) {
    await this.usersService.deleteUser(id, req.user);
    return this.createDeletedResponse('Xóa người dùng thành công');
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin profile cá nhân',
    description: 'Lấy thông tin profile của người dùng đang đăng nhập'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'Lấy profile thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy profile thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Lập trình web, React, Node.js',
          certification: 'AWS Certified Developer'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/users/profile/me',
        method: 'GET'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  async getProfile(@Request() req: any) {
    const profile = await this.usersService.getUserById(req.user.userId);
    return this.createSuccessResponse(
      profile,
      'Lấy profile thành công'
    );
  }
}
