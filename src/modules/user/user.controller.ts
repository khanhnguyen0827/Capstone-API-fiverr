import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery,
  ApiBearerAuth,
  ApiHeader
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, ROLES } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { BaseResponseDto, PaginationDto, FilterDto } from '../../common/dto/base.dto';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Tạo người dùng mới',
    description: 'Tạo tài khoản người dùng mới (Chỉ dành cho ADMIN)'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo người dùng thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email đã tồn tại trong hệ thống'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền tạo người dùng'
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<BaseResponseDto> {
    try {
      const result = await this.userService.create(createUserDto);
      return {
        message: 'Tạo người dùng thành công',
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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Lấy danh sách người dùng',
    description: 'Lấy danh sách tất cả người dùng với phân trang và bộ lọc (Chỉ dành cho ADMIN)'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Trang hiện tại', 
    example: 1,
    type: Number
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    description: 'Số lượng item mỗi trang (tối đa 100)', 
    example: 10,
    type: Number
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Tìm kiếm theo tên, email hoặc kỹ năng', 
    example: 'web developer'
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    description: 'Sắp xếp theo trường', 
    example: 'created_at',
    enum: ['id', 'ho_ten', 'email', 'role', 'created_at']
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    description: 'Thứ tự sắp xếp', 
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy danh sách người dùng thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Tham số không hợp lệ'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền xem danh sách người dùng'
  })
  async findAll(@Query() query: PaginationDto & FilterDto): Promise<BaseResponseDto> {
    const result = await this.userService.findAll(query);
    return {
      message: 'Lấy danh sách người dùng thành công',
      data: result.items,
      total: result.totalItem,
      page: result.page,
      limit: result.pageSize,
      totalPages: result.totalPage,
      status: 'success'
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Lấy thông tin profile của user hiện tại',
    description: 'Lấy thông tin chi tiết của người dùng đã đăng nhập'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy thông tin profile thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  async getProfile(@CurrentUser() user: any): Promise<BaseResponseDto> {
    const userData = await this.userService.findOne(user.userId);
    return {
      message: 'Lấy thông tin profile thành công',
      data: userData,
      status: 'success'
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Lấy thông tin người dùng theo ID',
    description: 'Lấy thông tin chi tiết của người dùng theo ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID người dùng', 
    example: 1,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy thông tin người dùng thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID không hợp lệ'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return {
      message: 'Lấy thông tin người dùng thành công',
      data: user,
      status: 'success'
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của người dùng (Chỉ có thể cập nhật profile của chính mình hoặc ADMIN có thể cập nhật tất cả)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID người dùng', 
    example: 1,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email đã tồn tại'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền cập nhật người dùng này'
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: any
  ): Promise<BaseResponseDto> {
    // Kiểm tra quyền: chỉ có thể cập nhật profile của chính mình hoặc ADMIN
    if (currentUser.userId !== id && currentUser.role !== ROLES.ADMIN) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật profile của chính mình');
    }

    try {
      const result = await this.userService.update(id, updateUserDto);
      return {
        message: 'Cập nhật thông tin người dùng thành công',
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Xóa người dùng',
    description: 'Xóa người dùng khỏi hệ thống (Chỉ dành cho ADMIN)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID người dùng', 
    example: 1,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Xóa thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID không hợp lệ'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền xóa người dùng'
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseDto> {
    const result = await this.userService.remove(id);
    return {
      message: 'Xóa người dùng thành công',
      data: result,
      status: 'success'
    };
  }
}
