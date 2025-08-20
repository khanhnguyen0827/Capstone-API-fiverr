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
import { CongViecService } from './cong-viec.service';
import { CreateCongViecDto } from './dto/create-cong-viec.dto';
import { UpdateCongViecDto } from './dto/update-cong-viec.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, ROLES } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { BaseResponseDto, PaginationDto, FilterDto } from '../../common/dto/base.dto';

@ApiTags('Jobs')
@Controller('cong-viec')
@UseInterceptors(ClassSerializerInterceptor)
export class CongViecController {
  constructor(private readonly congViecService: CongViecService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Tạo công việc mới',
    description: 'Tạo một công việc mới trong hệ thống'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo công việc thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Lỗi validation'
  })
  async create(
    @Body() createCongViecDto: CreateCongViecDto,
    @CurrentUser() user: any
  ): Promise<BaseResponseDto> {
    try {
      const result = await this.congViecService.create({
        ...createCongViecDto,
        nguoi_tao: user.userId
      });
      return {
        message: 'Tạo công việc thành công',
        data: result,
        status: 'success'
      };
    } catch (error) {
      throw new BadRequestException('Không thể tạo công việc: ' + error.message);
    }
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lấy danh sách công việc',
    description: 'Lấy danh sách tất cả công việc với phân trang và bộ lọc'
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
    description: 'Tìm kiếm theo tên, mô tả hoặc công ty', 
    example: 'web developer'
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    description: 'Sắp xếp theo trường', 
    example: 'gia_tien',
    enum: ['id', 'ten_cong_viec', 'gia_tien', 'danh_gia', 'created_at']
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    description: 'Thứ tự sắp xếp', 
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @ApiQuery({ 
    name: 'status', 
    required: false, 
    description: 'Lọc theo trạng thái', 
    example: 'AVAILABLE',
    enum: ['AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy danh sách công việc thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Tham số không hợp lệ'
  })
  async findAll(@Query() query: PaginationDto & FilterDto): Promise<BaseResponseDto> {
    const result = await this.congViecService.findAll(query);
    return {
      message: 'Lấy danh sách công việc thành công',
      data: result.items,
      total: result.totalItem,
      page: result.page,
      limit: result.pageSize,
      totalPages: result.totalPage,
      status: 'success'
    };
  }

  @Get('category/:maChiTietLoai')
  @ApiOperation({ 
    summary: 'Lấy công việc theo danh mục',
    description: 'Lấy danh sách công việc theo chi tiết loại công việc'
  })
  @ApiParam({ 
    name: 'maChiTietLoai', 
    description: 'ID chi tiết loại công việc', 
    example: 1,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy công việc theo danh mục thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID không hợp lệ'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Chi tiết loại công việc không tồn tại'
  })
  async findByCategory(@Param('maChiTietLoai', ParseIntPipe) maChiTietLoai: number): Promise<BaseResponseDto> {
    const result = await this.congViecService.findByCategory(maChiTietLoai);
    return {
      message: 'Lấy công việc theo danh mục thành công',
      data: result,
      status: 'success'
    };
  }

  @Get('user/:nguoiTao')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Lấy công việc theo người tạo',
    description: 'Lấy danh sách công việc được tạo bởi người dùng cụ thể'
  })
  @ApiParam({ 
    name: 'nguoiTao', 
    description: 'ID người tạo', 
    example: 1,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy công việc theo người tạo thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID không hợp lệ'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Người tạo không tồn tại'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  async findByUser(@Param('nguoiTao', ParseIntPipe) nguoiTao: number): Promise<BaseResponseDto> {
    const result = await this.congViecService.findByUser(nguoiTao);
    return {
      message: 'Lấy công việc theo người tạo thành công',
      data: result,
      status: 'success'
    };
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Lấy thông tin công việc theo ID',
    description: 'Lấy thông tin chi tiết của công việc theo ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID công việc', 
    example: 1,
    type: Number
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy thông tin công việc thành công',
    type: BaseResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'ID không hợp lệ'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy công việc'
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<BaseResponseDto> {
    const job = await this.congViecService.findOne(id);
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    return {
      message: 'Lấy thông tin công việc thành công',
      data: job,
      status: 'success'
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Cập nhật công việc',
    description: 'Cập nhật thông tin của công việc (Chỉ người tạo mới có thể cập nhật)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID công việc', 
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
    description: 'Không tìm thấy công việc'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền cập nhật công việc này'
  })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCongViecDto: UpdateCongViecDto,
    @CurrentUser() currentUser: any
  ): Promise<BaseResponseDto> {
    // Kiểm tra quyền: chỉ người tạo mới có thể cập nhật
    const job = await this.congViecService.findOne(id);
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    
    if (job.nguoi_tao !== currentUser.userId && currentUser.role !== ROLES.ADMIN) {
      throw new ForbiddenException('Bạn chỉ có thể cập nhật công việc của chính mình');
    }

    const result = await this.congViecService.update(id, updateCongViecDto);
    return {
      message: 'Cập nhật công việc thành công',
      data: result,
      status: 'success'
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Xóa công việc',
    description: 'Xóa công việc khỏi hệ thống (Chỉ người tạo mới có thể xóa)'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID công việc', 
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
    description: 'Không tìm thấy công việc'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền xóa công việc này'
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any
  ): Promise<BaseResponseDto> {
    // Kiểm tra quyền: chỉ người tạo mới có thể xóa
    const job = await this.congViecService.findOne(id);
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc');
    }
    
    if (job.nguoi_tao !== currentUser.userId && currentUser.role !== ROLES.ADMIN) {
      throw new ForbiddenException('Bạn chỉ có thể xóa công việc của chính mình');
    }

    const result = await this.congViecService.remove(id);
    return {
      message: 'Xóa công việc thành công',
      data: result,
      status: 'success'
    };
  }
}
