import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ThueCongViecService } from './thue-cong-viec.service';
import { CreateThueCongViecDto } from './dto/create-thue-cong-viec.dto';
import { UpdateThueCongViecDto } from './dto/update-thue-cong-viec.dto';

@ApiTags('thue-cong-viec')
@Controller('thue-cong-viec')
export class ThueCongViecController {
  constructor(private readonly thueCongViecService: ThueCongViecService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo thuê công việc mới' })
  @ApiResponse({ status: 201, description: 'Tạo thuê công việc thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createThueCongViecDto: CreateThueCongViecDto) {
    return await this.thueCongViecService.create(createThueCongViecDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thuê công việc' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Số lượng item mỗi trang', example: 10 })
  @ApiQuery({ name: 'filters', required: false, description: 'Bộ lọc JSON', example: '{"ma_cong_viec":1,"hoan_thanh":false}' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thuê công việc thành công' })
  async findAll(@Query() query: any) {
    return await this.thueCongViecService.findAll(query);
  }

  @Get('cong-viec/:maCongViec')
  @ApiOperation({ summary: 'Lấy thuê công việc theo công việc' })
  @ApiParam({ name: 'maCongViec', description: 'ID công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thuê công việc theo công việc thành công' })
  async findByCongViec(@Param('maCongViec', ParseIntPipe) maCongViec: number) {
    return await this.thueCongViecService.findByCongViec(maCongViec);
  }

  @Get('user/:maNguoiThue')
  @ApiOperation({ summary: 'Lấy thuê công việc theo người thuê' })
  @ApiParam({ name: 'maNguoiThue', description: 'ID người thuê', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thuê công việc theo người thuê thành công' })
  async findByUser(@Param('maNguoiThue', ParseIntPipe) maNguoiThue: number) {
    return await this.thueCongViecService.findByUser(maNguoiThue);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin thuê công việc theo ID' })
  @ApiParam({ name: 'id', description: 'ID thuê công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thuê công việc thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.thueCongViecService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thuê công việc' })
  @ApiParam({ name: 'id', description: 'ID thuê công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateThueCongViecDto: UpdateThueCongViecDto
  ) {
    return await this.thueCongViecService.update(id, updateThueCongViecDto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Hoàn thành công việc' })
  @ApiParam({ name: 'id', description: 'ID thuê công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Hoàn thành công việc thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  async completeJob(@Param('id', ParseIntPipe) id: number) {
    return await this.thueCongViecService.completeJob(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thuê công việc' })
  @ApiParam({ name: 'id', description: 'ID thuê công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.thueCongViecService.remove(id);
  }
}
