import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ChiTietLoaiCongViecService } from './chi-tiet-loai-cong-viec.service';
import { CreateChiTietLoaiCongViecDto } from './dto/create-chi-tiet-loai-cong-viec.dto';
import { UpdateChiTietLoaiCongViecDto } from './dto/update-chi-tiet-loai-cong-viec.dto';

@ApiTags('chi-tiet-loai-cong-viec')
@Controller('chi-tiet-loai-cong-viec')
export class ChiTietLoaiCongViecController {
  constructor(private readonly chiTietLoaiCongViecService: ChiTietLoaiCongViecService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo chi tiết loại công việc mới' })
  @ApiResponse({ status: 201, description: 'Tạo chi tiết loại công việc thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createChiTietLoaiCongViecDto: CreateChiTietLoaiCongViecDto) {
    return await this.chiTietLoaiCongViecService.create(createChiTietLoaiCongViecDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chi tiết loại công việc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách chi tiết loại công việc thành công' })
  async findAll() {
    return await this.chiTietLoaiCongViecService.findAll();
  }

  @Get('loai-cong-viec/:maLoaiCongViec')
  @ApiOperation({ summary: 'Lấy chi tiết loại công việc theo loại công việc' })
  @ApiParam({ name: 'maLoaiCongViec', description: 'ID loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy chi tiết loại công việc theo loại công việc thành công' })
  async findByLoaiCongViec(@Param('maLoaiCongViec', ParseIntPipe) maLoaiCongViec: number) {
    return await this.chiTietLoaiCongViecService.findByLoaiCongViec(maLoaiCongViec);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết loại công việc theo ID' })
  @ApiParam({ name: 'id', description: 'ID chi tiết loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin chi tiết loại công việc thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chi tiết loại công việc' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.chiTietLoaiCongViecService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật chi tiết loại công việc' })
  @ApiParam({ name: 'id', description: 'ID chi tiết loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chi tiết loại công việc' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateChiTietLoaiCongViecDto: UpdateChiTietLoaiCongViecDto
  ) {
    return await this.chiTietLoaiCongViecService.update(id, updateChiTietLoaiCongViecDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa chi tiết loại công việc' })
  @ApiParam({ name: 'id', description: 'ID chi tiết loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chi tiết loại công việc' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.chiTietLoaiCongViecService.remove(id);
  }
}
