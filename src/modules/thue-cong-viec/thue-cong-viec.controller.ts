import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ThueCongViecService } from './thue-cong-viec.service';
import { CreateThueCongViecDto } from './dto/create-thue-cong-viec.dto';
import { UpdateThueCongViecDto } from './dto/update-thue-cong-viec.dto';

@Controller('thue-cong-viec')
export class ThueCongViecController {
  constructor(private readonly thueCongViecService: ThueCongViecService) {}

  @Post()
  async create(@Body() createThueCongViecDto: CreateThueCongViecDto) {
    return await this.thueCongViecService.create(createThueCongViecDto);
  }

  @Get()
  async findAll(@Query() query: any) {
    return await this.thueCongViecService.findAll(query);
  }

  @Get('cong-viec/:maCongViec')
  async findByCongViec(@Param('maCongViec', ParseIntPipe) maCongViec: number) {
    return await this.thueCongViecService.findByCongViec(maCongViec);
  }

  @Get('user/:maNguoiThue')
  async findByUser(@Param('maNguoiThue', ParseIntPipe) maNguoiThue: number) {
    return await this.thueCongViecService.findByUser(maNguoiThue);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.thueCongViecService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateThueCongViecDto: UpdateThueCongViecDto
  ) {
    return await this.thueCongViecService.update(id, updateThueCongViecDto);
  }

  @Patch(':id/complete')
  async completeJob(@Param('id', ParseIntPipe) id: number) {
    return await this.thueCongViecService.completeJob(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.thueCongViecService.remove(id);
  }
}
