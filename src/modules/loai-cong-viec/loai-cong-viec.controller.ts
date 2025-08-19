import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LoaiCongViecService } from './loai-cong-viec.service';
import { CreateLoaiCongViecDto } from './dto/create-loai-cong-viec.dto';
import { UpdateLoaiCongViecDto } from './dto/update-loai-cong-viec.dto';

@Controller('loai-cong-viec')
export class LoaiCongViecController {
  constructor(private readonly loaiCongViecService: LoaiCongViecService) {}

  @Post()
  async create(@Body() createLoaiCongViecDto: CreateLoaiCongViecDto) {
    return await this.loaiCongViecService.create(createLoaiCongViecDto);
  }

  @Get()
  async findAll() {
    return await this.loaiCongViecService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.loaiCongViecService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateLoaiCongViecDto: UpdateLoaiCongViecDto
  ) {
    return await this.loaiCongViecService.update(id, updateLoaiCongViecDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.loaiCongViecService.remove(id);
  }
}
