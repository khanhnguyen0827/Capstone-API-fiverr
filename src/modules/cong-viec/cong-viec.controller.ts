import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CongViecService } from './cong-viec.service';
import { CreateCongViecDto } from './dto/create-cong-viec.dto';
import { UpdateCongViecDto } from './dto/update-cong-viec.dto';

@ApiTags('cong-viec')
@Controller('cong-viec')
export class CongViecController {
  constructor(private readonly congViecService: CongViecService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo công việc mới' })
  @ApiResponse({ status: 201, description: 'Tạo công việc thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createCongViecDto: CreateCongViecDto) {
    return await this.congViecService.create(createCongViecDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách công việc' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Số lượng item mỗi trang (tối đa 100)', example: 10 })
  @ApiQuery({ name: 'filters', required: false, description: 'Bộ lọc JSON', example: '{"ten_cong_viec":"web","gia_tien":1000000}' })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm kiếm theo tên, mô tả hoặc công ty', example: 'web developer' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sắp xếp theo trường', example: 'gia_tien', enum: ['id', 'ten_cong_viec', 'gia_tien'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Thứ tự sắp xếp', example: 'desc', enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Lấy danh sách công việc thành công' })
  @ApiResponse({ status: 400, description: 'Tham số không hợp lệ' })
  async findAll(@Query() query: any) {
    return await this.congViecService.findAll(query);
  }

  @Get('category/:maChiTietLoai')
  @ApiOperation({ summary: 'Lấy công việc theo danh mục' })
  @ApiParam({ name: 'maChiTietLoai', description: 'ID chi tiết loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy công việc theo danh mục thành công' })
  @ApiResponse({ status: 400, description: 'ID không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Chi tiết loại công việc không tồn tại' })
  async findByCategory(@Param('maChiTietLoai', ParseIntPipe) maChiTietLoai: number) {
    return await this.congViecService.findByCategory(maChiTietLoai);
  }

  @Get('user/:nguoiTao')
  @ApiOperation({ summary: 'Lấy công việc theo người tạo' })
  @ApiParam({ name: 'nguoiTao', description: 'ID người tạo', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy công việc theo người tạo thành công' })
  @ApiResponse({ status: 400, description: 'ID không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Người tạo không tồn tại' })
  async findByUser(@Param('nguoiTao', ParseIntPipe) nguoiTao: number) {
    return await this.congViecService.findByUser(nguoiTao);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin công việc theo ID' })
  @ApiParam({ name: 'id', description: 'ID công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin công việc thành công' })
  @ApiResponse({ status: 400, description: 'ID không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy công việc' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.congViecService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật công việc' })
  @ApiParam({ name: 'id', description: 'ID công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy công việc' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCongViecDto: UpdateCongViecDto
  ) {
    return await this.congViecService.update(id, updateCongViecDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa công việc' })
  @ApiParam({ name: 'id', description: 'ID công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 400, description: 'ID không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy công việc' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.congViecService.remove(id);
  }
}
