import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { BinhLuanService } from './binh-luan.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('binh-luan')
@Controller('binh-luan')
export class BinhLuanController {
  constructor(private readonly binhLuanService: BinhLuanService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo bình luận mới' })
  @ApiResponse({ status: 201, description: 'Bình luận đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Không được phép truy cập' })
  create(@Body() createBinhLuanDto: CreateBinhLuanDto) {
    return this.binhLuanService.create(createBinhLuanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bình luận' })
  @ApiResponse({ status: 200, description: 'Danh sách bình luận' })
  findAll(@Query() query: any) {
    return this.binhLuanService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy bình luận theo ID' })
  @ApiResponse({ status: 200, description: 'Thông tin bình luận' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  findOne(@Param('id') id: string) {
    return this.binhLuanService.findOne(+id);
  }

  @Get('thue-cong-viec/:maThueCongViec')
  @ApiOperation({ summary: 'Lấy bình luận theo thuê công việc' })
  @ApiResponse({ status: 200, description: 'Danh sách bình luận' })
  findByThueCongViec(@Param('maThueCongViec') maThueCongViec: string) {
    return this.binhLuanService.findByThueCongViec(+maThueCongViec);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy bình luận theo người dùng' })
  @ApiResponse({ status: 200, description: 'Danh sách bình luận' })
  findByUser(@Param('userId') userId: string) {
    return this.binhLuanService.findByUser(+userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật bình luận' })
  @ApiResponse({ status: 200, description: 'Bình luận đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  @ApiResponse({ status: 401, description: 'Không được phép truy cập' })
  update(@Param('id') id: string, @Body() updateBinhLuanDto: UpdateBinhLuanDto) {
    return this.binhLuanService.update(+id, updateBinhLuanDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bình luận' })
  @ApiResponse({ status: 200, description: 'Bình luận đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  @ApiResponse({ status: 401, description: 'Không được phép truy cập' })
  remove(@Param('id') id: string) {
    return this.binhLuanService.remove(+id);
  }
}
