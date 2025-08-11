import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, JobSearchDto } from './dto/jobs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

@ApiTags('Jobs Management')
@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách công việc',
    description: 'Lấy danh sách tất cả công việc với phân trang, tìm kiếm và lọc theo danh mục'
  })
  @ApiQuery({
    name: 'page',
    description: 'Số trang (mặc định: 1)',
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'size',
    description: 'Số lượng item trên mỗi trang (mặc định: 10)',
    required: false,
    type: Number,
    example: 10
  })
  @ApiQuery({
    name: 'search',
    description: 'Từ khóa tìm kiếm trong tên công việc',
    required: false,
    type: String,
    example: 'website'
  })
  @ApiQuery({
    name: 'category',
    description: 'ID danh mục công việc để lọc',
    required: false,
    type: Number,
    example: 4
  })
  @ApiOkResponse({
    description: 'Lấy danh sách công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách công việc thành công',
        content: {
          data: [
            {
              id: 1,
              ten_cong_viec: 'Thiết kế website bán hàng',
              danh_gia: 5,
              gia_tien: 5000000,
              hinh_anh: 'website-design.jpg',
              mo_ta: 'Thiết kế website bán hàng chuyên nghiệp',
              mo_ta_ngan: 'Website bán hàng responsive',
              sao_cong_viec: 5,
              ma_chi_tiet_loai: 4,
              nguoi_tao: 1
            }
          ],
          pagination: {
            page: 1,
            size: 10,
            total: 1,
            totalPages: 1
          }
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async getJobs(
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const result = await this.jobsService.getJobs(
      parseInt(page),
      parseInt(size),
      search,
      category,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách công việc thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @Post('search')
  @ApiOperation({
    summary: 'Tìm kiếm công việc nâng cao',
    description: 'Tìm kiếm công việc với nhiều tiêu chí: từ khóa, danh mục, giá tiền, đánh giá'
  })
  @ApiBody({ type: JobSearchDto })
  @ApiQuery({
    name: 'page',
    description: 'Số trang (mặc định: 1)',
    required: false,
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'size',
    description: 'Số lượng item trên mỗi trang (mặc định: 10)',
    required: false,
    type: Number,
    example: 10
  })
  @ApiOkResponse({
    description: 'Tìm kiếm công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Tìm kiếm công việc thành công',
        content: {
          data: [
            {
              id: 1,
              ten_cong_viec: 'Thiết kế website bán hàng',
              danh_gia: 5,
              gia_tien: 5000000,
              hinh_anh: 'website-design.jpg',
              mo_ta: 'Thiết kế website bán hàng chuyên nghiệp',
              mo_ta_ngan: 'Website bán hàng responsive',
              sao_cong_viec: 5,
              ma_chi_tiet_loai: 4,
              nguoi_tao: 1
            }
          ],
          pagination: {
            page: 1,
            size: 10,
            total: 1,
            totalPages: 1
          }
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async searchJobs(
    @Body() searchDto: JobSearchDto,
    @Query('page') page: string = '1',
    @Query('size') size: string = '10',
  ) {
    const result = await this.jobsService.searchJobs(
      searchDto,
      parseInt(page),
      parseInt(size),
    );
    return {
      statusCode: 200,
      message: 'Tìm kiếm công việc thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin công việc theo ID',
    description: 'Lấy thông tin chi tiết của một công việc cụ thể'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của công việc',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Lấy thông tin công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin công việc thành công',
        content: {
          id: 1,
          ten_cong_viec: 'Thiết kế website bán hàng',
          danh_gia: 5,
          gia_tien: 5000000,
          hinh_anh: 'website-design.jpg',
          mo_ta: 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp và responsive',
          mo_ta_ngan: 'Website bán hàng responsive',
          sao_cong_viec: 5,
          ma_chi_tiet_loai: 4,
          nguoi_tao: 1
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại'
  })
  async getJobById(@Param('id') id: string) {
    const result = await this.jobsService.getJobById(parseInt(id));
    return {
      statusCode: 200,
      message: 'Lấy thông tin công việc thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo công việc mới',
    description: 'Tạo một công việc mới (cần xác thực)'
  })
  @ApiBody({ type: CreateJobDto })
  @ApiCreatedResponse({
    description: 'Tạo công việc thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo công việc thành công',
        content: {
          id: 2,
          ten_cong_viec: 'Lập trình ứng dụng mobile',
          danh_gia: 0,
          gia_tien: 8000000,
          hinh_anh: 'mobile-app.jpg',
          mo_ta: 'Phát triển ứng dụng mobile cho iOS và Android',
          mo_ta_ngan: 'App mobile iOS/Android',
          sao_cong_viec: 0,
          ma_chi_tiet_loai: 2,
          nguoi_tao: 1
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  async createJob(@Body() createJobDto: CreateJobDto, @Request() req) {
    const result = await this.jobsService.createJob(createJobDto, req.user.userId);
    return {
      statusCode: 201,
      message: 'Tạo công việc thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật công việc',
    description: 'Cập nhật thông tin của công việc (cần xác thực và quyền sở hữu)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của công việc cần cập nhật',
    type: Number,
    example: 1
  })
  @ApiBody({ type: UpdateJobDto })
  @ApiOkResponse({
    description: 'Cập nhật công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật công việc thành công',
        content: {
          id: 1,
          ten_cong_viec: 'Thiết kế website bán hàng (Updated)',
          danh_gia: 5,
          gia_tien: 6000000,
          hinh_anh: 'website-design-updated.jpg',
          mo_ta: 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp, responsive và SEO tối ưu',
          mo_ta_ngan: 'Website bán hàng responsive với SEO',
          sao_cong_viec: 5,
          ma_chi_tiet_loai: 4,
          nguoi_tao: 1
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật công việc này'
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại'
  })
  async updateJob(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @Request() req) {
    const result = await this.jobsService.updateJob(parseInt(id), updateJobDto, req.user);
    return {
      statusCode: 200,
      message: 'Cập nhật công việc thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa công việc',
    description: 'Xóa một công việc (cần xác thực và quyền sở hữu)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của công việc cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa công việc thành công',
        content: null,
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa công việc này'
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại'
  })
  async deleteJob(@Param('id') id: string, @Request() req) {
    await this.jobsService.deleteJob(parseInt(id), req.user);
    return {
      statusCode: 200,
      message: 'Xóa công việc thành công',
      content: null,
      dateTime: new Date().toISOString(),
    };
  }

  @Get('categories/list')
  @ApiOperation({
    summary: 'Lấy danh sách danh mục công việc',
    description: 'Lấy danh sách tất cả các danh mục công việc có sẵn'
  })
  @ApiOkResponse({
    description: 'Lấy danh sách danh mục công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách danh mục công việc thành công',
        content: [
          {
            id: 1,
            ten_chi_tiet: 'Lập trình web',
            hinh_anh: 'web-dev.jpg',
            ma_loai_cong_viec: 1
          },
          {
            id: 2,
            ten_chi_tiet: 'Lập trình mobile',
            hinh_anh: 'mobile-dev.jpg',
            ma_loai_cong_viec: 1
          }
        ],
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async getJobCategories() {
    const result = await this.jobsService.getJobCategories();
    return {
      statusCode: 200,
      message: 'Lấy danh sách danh mục công việc thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }
}
