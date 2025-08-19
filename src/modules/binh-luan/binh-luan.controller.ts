import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';

@ApiTags('binh-luan')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bình luận mới' })
  @ApiResponse({ status: 201, description: 'Tạo bình luận thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createBinhLuanDto: CreateBinhLuanDto) {
    return await this.binhLuanService.create(createBinhLuanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bình luận' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại', example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Số lượng item mỗi trang', example: 10 })
  @ApiQuery({ name: 'filters', required: false, description: 'Bộ lọc JSON', example: '{"ma_cong_viec":1,"sao_binh_luan":5}' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách bình luận thành công' })
  async findAll(@Query() query: any) {
    return await this.binhLuanService.findAll(query);
  }

  @Get('cong-viec/:maCongViec')
  @ApiOperation({ summary: 'Lấy bình luận theo công việc' })
  @ApiParam({ name: 'maCongViec', description: 'ID công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy bình luận theo công việc thành công' })
  async findByCongViec(@Param('maCongViec', ParseIntPipe) maCongViec: number) {
    return await this.binhLuanService.findByCongViec(maCongViec);
  }

  @Get('user/:maNguoiBinhLuan')
  @ApiOperation({ summary: 'Lấy bình luận theo người bình luận' })
  @ApiParam({ name: 'maNguoiBinhLuan', description: 'ID người bình luận', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy bình luận theo người bình luận thành công' })
  async findByUser(@Param('maNguoiBinhLuan', ParseIntPipe) maNguoiBinhLuan: number) {
    return await this.binhLuanService.findByUser(maNguoiBinhLuan);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin bình luận theo ID' })
  @ApiParam({ name: 'id', description: 'ID bình luận', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin bình luận thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.binhLuanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bình luận' })
  @ApiParam({ name: 'id', description: 'ID bình luận', example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBinhLuanDto: UpdateBinhLuanDto
  ) {
    return await this.binhLuanService.update(id, updateBinhLuanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bình luận' })
  @ApiParam({ name: 'id', description: 'ID bình luận', example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.binhLuanService.remove(id);
  }
}
