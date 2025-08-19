import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';

@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @Post()
  async create(@Body() createBinhLuanDto: CreateBinhLuanDto) {
    return await this.binhLuanService.create(createBinhLuanDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.binhLuanService.findAll(query);
  }

  @Get('cong-viec/:maCongViec')
  async findByCongViec(@Param('maCongViec', ParseIntPipe) maCongViec: number) {
    return await this.binhLuanService.findByCongViec(maCongViec);
  }

  @Get('user/:maNguoiBinhLuan')
  async findByUser(@Param('maNguoiBinhLuan', ParseIntPipe) maNguoiBinhLuan: number) {
    return await this.binhLuanService.findByUser(maNguoiBinhLuan);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.binhLuanService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateBinhLuanDto: UpdateBinhLuanDto
  ) {
    return await this.binhLuanService.update(id, updateBinhLuanDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.binhLuanService.remove(id);
  }
}
