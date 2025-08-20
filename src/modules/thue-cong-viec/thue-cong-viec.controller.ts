import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ThueCongViecService } from './thue-cong-viec.service';
import { CreateThueCongViecDto } from './dto/create-thue-cong-viec.dto';
import { UpdateThueCongViecDto } from './dto/update-thue-cong-viec.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('thue-cong-viec')
@Controller('thue-cong-viec')
export class ThueCongViecController {
  constructor(private readonly thueCongViecService: ThueCongViecService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo thuê công việc mới' })
  @ApiResponse({ status: 201, description: 'Thuê công việc đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không được phép truy cập' })
  create(@Body() createThueCongViecDto: CreateThueCongViecDto) {
    return this.thueCongViecService.create(createThueCongViecDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thuê công việc' })
  @ApiResponse({ status: 200, description: 'Danh sách thuê công việc' })
  findAll(@Query() query: any) {
    return this.thueCongViecService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thuê công việc theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin thuê công việc' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  findOne(@Param('id') id: string) {
    return this.thueCongViecService.findOne(+id);
  }

  @Get('cong-viec/:congViecId')
  @ApiOperation({ summary: 'Lấy thuê công việc theo công việc' })
  @ApiResponse({ status: 200, description: 'Danh sách thuê công việc' })
  findByCongViec(@Param('congViecId') congViecId: string) {
    return this.thueCongViecService.findByCongViec(+congViecId);
  }

  @Get('client/:clientId')
  @ApiOperation({ summary: 'Lấy thuê công việc theo khách hàng' })
  @ApiResponse({ status: 200, description: 'Danh sách thuê công việc' })
  findByClient(@Param('clientId') clientId: string) {
    return this.thueCongViecService.findByClient(+clientId);
  }

  @Get('freelancer/:freelancerId')
  @ApiOperation({ summary: 'Lấy thuê công việc theo freelancer' })
  @ApiResponse({ status: 200, description: 'Danh sách thuê công việc' })
  findByFreelancer(@Param('freelancerId') freelancerId: string) {
    return this.thueCongViecService.findByFreelancer(+freelancerId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Lấy thuê công việc theo trạng thái' })
  @ApiResponse({ status: 200, description: 'Danh sách thuê công việc' })
  findByStatus(@Param('status') status: string) {
    return this.thueCongViecService.findByStatus(status);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thuê công việc' })
  @ApiResponse({ status: 200, description: 'Thuê công việc đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  @ApiResponse({ status: 401, description: 'Không được phép truy cập' })
  update(@Param('id') id: string, @Body() updateThueCongViecDto: UpdateThueCongViecDto) {
    return this.thueCongViecService.update(+id, updateThueCongViecDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa thuê công việc' })
  @ApiResponse({ status: 200, description: 'Thuê công việc đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thuê công việc' })
  @ApiResponse({ status: 401, description: 'Không được phép truy cập' })
  remove(@Param('id') id: string) {
    return this.thueCongViecService.remove(+id);
  }
}
