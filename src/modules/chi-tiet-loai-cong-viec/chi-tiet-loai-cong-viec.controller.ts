import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ChiTietLoaiCongViecService } from './chi-tiet-loai-cong-viec.service';
import { CreateChiTietLoaiCongViecDto } from './dto/create-chi-tiet-loai-cong-viec.dto';
import { UpdateChiTietLoaiCongViecDto } from './dto/update-chi-tiet-loai-cong-viec.dto';

@Controller('chi-tiet-loai-cong-viec')
export class ChiTietLoaiCongViecController {
  constructor(private readonly chiTietLoaiCongViecService: ChiTietLoaiCongViecService) {}

  @Post()
  async create(@Body() createChiTietLoaiCongViecDto: CreateChiTietLoaiCongViecDto) {
    return await this.chiTietLoaiCongViecService.create(createChiTietLoaiCongViecDto);
  }

  @Get()
  async findAll() {
    return await this.chiTietLoaiCongViecService.findAll();
  }

  @Get('loai-cong-viec/:maLoaiCongViec')
  async findByLoaiCongViec(@Param('maLoaiCongViec', ParseIntPipe) maLoaiCongViec: number) {
    return await this.chiTietLoaiCongViecService.findByLoaiCongViec(maLoaiCongViec);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.chiTietLoaiCongViecService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateChiTietLoaiCongViecDto: UpdateChiTietLoaiCongViecDto
  ) {
    return await this.chiTietLoaiCongViecService.update(id, updateChiTietLoaiCongViecDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.chiTietLoaiCongViecService.remove(id);
  }
}
