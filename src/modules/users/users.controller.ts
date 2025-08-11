import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

@ApiTags('Users Management')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description: 'Lấy danh sách tất cả người dùng với phân trang'
  })
  @ApiQuery({
    name: 'page',
    description: 'Số trang (mặc định: 1)',
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'size',
    description: 'Số lượng item trên mỗi trang (mặc định: 10)',
    required: false,
    type: Number,
    example: 10
  })
  @ApiOkResponse({
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
              email: 'user1@example.com',
              phone: '0123456789',
              birth_day: '1990-01-01',
              gender: 'Nam',
              role: 'freelancer',
              skill: 'Lập trình web',
              certification: 'AWS Certified'
            }
          ],
          pagination: {
            page: 1,
            size: 10,
            total: 1,
            totalPages: 1
          }
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async getUsers(@Query('page') page: string = '1', @Query('size') size: string = '10') {
    const result = await this.usersService.getUsers(parseInt(page), parseInt(size));
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin người dùng theo ID',
    description: 'Lấy thông tin chi tiết của một người dùng cụ thể'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Lấy thông tin người dùng thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin người dùng thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Lập trình web',
          certification: 'AWS Certified'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại',
    schema: {
      example: {
        statusCode: 404,
        message: 'Người dùng không tồn tại',
        content: null,
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async getUserById(@Param('id') id: string) {
    const result = await this.usersService.getUserById(parseInt(id));
    return {
      statusCode: 200,
      message: 'Lấy thông tin người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo một người dùng mới với thông tin được cung cấp'
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
          email: 'user2@example.com',
          phone: '0987654321',
          birth_day: '1992-05-15',
          gender: 'Nữ',
          role: 'client',
          skill: 'Marketing',
          certification: 'Google Ads Certified'
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
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return {
      statusCode: 201,
      message: 'Tạo người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của người dùng (cần xác thực)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng cần cập nhật',
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
          name: 'Nguyễn Văn A (Updated)',
          email: 'user@example.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Lập trình web, React',
          certification: 'AWS Certified, React Certified'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
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
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const result = await this.usersService.updateUser(parseInt(id), updateUserDto, req.user);
    return {
      statusCode: 200,
      message: 'Cập nhật người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa một người dùng (cần xác thực và quyền)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của người dùng cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa người dùng thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa người dùng thành công',
        content: null,
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa người dùng này'
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại'
  })
  async deleteUser(@Param('id') id: string, @Request() req) {
    await this.usersService.deleteUser(parseInt(id), req.user);
    return {
      statusCode: 200,
      message: 'Xóa người dùng thành công',
      content: null,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin profile của user hiện tại',
    description: 'Lấy thông tin chi tiết của người dùng đang đăng nhập'
  })
  @ApiOkResponse({
    description: 'Lấy thông tin profile thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin profile thành công',
        content: {
          id: 1,
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0123456789',
          birth_day: '1990-01-01',
          gender: 'Nam',
          role: 'freelancer',
          skill: 'Lập trình web',
          certification: 'AWS Certified'
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  async getProfile(@Request() req) {
    const result = await this.usersService.getUserById(req.user.userId);
    return {
      statusCode: 200,
      message: 'Lấy thông tin profile thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }
}
