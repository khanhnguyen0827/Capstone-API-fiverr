import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CongViecService } from './cong-viec.service';
import { CreateCongViecDto } from './dto/create-cong-viec.dto';
import { UpdateCongViecDto } from './dto/update-cong-viec.dto';

@Controller('cong-viec')
export class CongViecController {
  constructor(private readonly congViecService: CongViecService) {}

  @Post()
  async create(@Body() createCongViecDto: CreateCongViecDto) {
    return await this.congViecService.create(createCongViecDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.congViecService.findAll(query);
  }

  @Get('category/:maChiTietLoai')
  async findByCategory(@Param('maChiTietLoai', ParseIntPipe) maChiTietLoai: number) {
    return await this.congViecService.findByCategory(maChiTietLoai);
  }

  @Get('user/:nguoiTao')
  async findByUser(@Param('nguoiTao', ParseIntPipe) nguoiTao: number) {
    return await this.congViecService.findByUser(nguoiTao);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.congViecService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateCongViecDto: UpdateCongViecDto
  ) {
    return await this.congViecService.update(id, updateCongViecDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.congViecService.remove(id);
  }
}
