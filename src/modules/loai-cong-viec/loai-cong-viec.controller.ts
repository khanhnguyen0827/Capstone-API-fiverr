import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { LoaiCongViecService } from './loai-cong-viec.service';
import { CreateLoaiCongViecDto } from './dto/create-loai-cong-viec.dto';
import { UpdateLoaiCongViecDto } from './dto/update-loai-cong-viec.dto';

@ApiTags('loai-cong-viec')
@Controller('loai-cong-viec')
export class LoaiCongViecController {
  constructor(private readonly loaiCongViecService: LoaiCongViecService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo loại công việc mới' })
  @ApiResponse({ status: 201, description: 'Tạo loại công việc thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(@Body() createLoaiCongViecDto: CreateLoaiCongViecDto) {
    return await this.loaiCongViecService.create(createLoaiCongViecDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách loại công việc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách loại công việc thành công' })
  async findAll() {
    return await this.loaiCongViecService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin loại công việc theo ID' })
  @ApiParam({ name: 'id', description: 'ID loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Lấy thông tin loại công việc thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại công việc' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.loaiCongViecService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật loại công việc' })
  @ApiParam({ name: 'id', description: 'ID loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại công việc' })
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLoaiCongViecDto: UpdateLoaiCongViecDto
  ) {
    return await this.loaiCongViecService.update(id, updateLoaiCongViecDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa loại công việc' })
  @ApiParam({ name: 'id', description: 'ID loại công việc', example: 1 })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại công việc' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.loaiCongViecService.remove(id);
  }
}
