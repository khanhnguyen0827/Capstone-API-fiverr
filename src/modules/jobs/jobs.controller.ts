import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, JobSearchDto } from './dto/jobs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseController } from '../../common/base';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController extends BaseController {
  constructor(private readonly jobsService: JobsService) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc',
    description: 'Lấy danh sách tất cả công việc với phân trang và tìm kiếm'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm trong tên công việc',
    type: String,
    example: 'website'
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'ID danh mục công việc',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách công việc thành công',
        content: {
          data: [
            {
              id: 1,
              ten_cong_viec: 'Thiết kế website responsive',
              danh_gia: 5,
              gia_tien: 2000000,
              hinh_anh: 'website-design.jpg',
              mo_ta: 'Thiết kế website responsive chuyên nghiệp',
              ma_chi_tiet_loai: 1,
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
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const { page: validPage, size: validSize } = this.jobsService.validatePagination(page, size);
    const result = await this.jobsService.getJobs(validPage, validSize, search, category);
    
    return this.createPaginatedResponse(
      result.data,
      result.pagination,
      'Lấy danh sách công việc thành công'
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin công việc theo ID',
    description: 'Lấy chi tiết công việc dựa trên ID'
  })
  @ApiParam({
    name: 'id',
    description: 'ID công việc',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin công việc thành công',
        content: {
          id: 1,
          ten_cong_viec: 'Thiết kế website responsive',
          danh_gia: 5,
          gia_tien: 2000000,
          hinh_anh: 'website-design.jpg',
          mo_ta: 'Thiết kế website responsive chuyên nghiệp',
          ma_chi_tiet_loai: 1,
          nguoi_tao: 1,
          chiTietLoaiCongViec: {
            id: 1,
            ten_chi_tiet: 'Lập trình web',
            hinh_anh: 'web-dev.jpg',
            ma_loai_cong_viec: 1,
            loaiCongViec: {
              id: 1,
              ten_loai_cong_viec: 'Công nghệ thông tin'
            }
          },
          nguoiTao: {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com'
          }
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Công việc không tồn tại'
  })
  async getJobById(@Param('id') id: number) {
    const job = await this.jobsService.getJobById(id);
    return this.createSuccessResponse(
      job,
      'Lấy thông tin công việc thành công'
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo công việc mới',
    description: 'Tạo công việc mới (yêu cầu đăng nhập)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateJobDto })
  @ApiCreatedResponse({
    description: 'Tạo công việc thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo công việc thành công',
        content: {
          id: 1,
          ten_cong_viec: 'Thiết kế website responsive',
          danh_gia: 0,
          gia_tien: 2000000,
          hinh_anh: 'website-design.jpg',
          mo_ta: 'Thiết kế website responsive chuyên nghiệp',
          ma_chi_tiet_loai: 1,
          nguoi_tao: 1
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  async createJob(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    const job = await this.jobsService.createJob(createJobDto, req.user.userId);
    return this.createCreatedResponse(
      job,
      'Tạo công việc thành công'
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật công việc',
    description: 'Cập nhật thông tin công việc (yêu cầu đăng nhập và quyền sở hữu)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID công việc cần cập nhật',
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
          ten_cong_viec: 'Thiết kế website responsive (Đã cập nhật)',
          danh_gia: 5,
          gia_tien: 2500000,
          hinh_anh: 'website-design-updated.jpg',
          mo_ta: 'Thiết kế website responsive chuyên nghiệp với UI/UX hiện đại',
          ma_chi_tiet_loai: 1,
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
  async updateJob(
    @Param('id') id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: any,
  ) {
    const job = await this.jobsService.updateJob(id, updateJobDto, req.user);
    return this.createUpdatedResponse(
      job,
      'Cập nhật công việc thành công'
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa công việc',
    description: 'Xóa công việc (yêu cầu đăng nhập và quyền sở hữu)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID công việc cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa công việc thành công',
        content: {
          message: 'Xóa công việc thành công'
        },
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
  async deleteJob(@Param('id') id: number, @Request() req: any) {
    await this.jobsService.deleteJob(id, req.user);
    return this.createDeletedResponse('Xóa công việc thành công');
  }

  @Get('categories/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục công việc',
    description: 'Lấy tất cả danh mục và chi tiết danh mục công việc'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh mục thành công',
        content: [
          {
            id: 1,
            ten_chi_tiet: 'Lập trình web',
            hinh_anh: 'web-dev.jpg',
            ma_loai_cong_viec: 1,
            loaiCongViec: {
              id: 1,
              ten_loai_cong_viec: 'Công nghệ thông tin'
            }
          }
        ],
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async getJobCategories() {
    const categories = await this.jobsService.getJobCategories();
    return this.createSuccessResponse(
      categories,
      'Lấy danh mục thành công'
    );
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tìm kiếm công việc nâng cao',
    description: 'Tìm kiếm công việc với nhiều tiêu chí khác nhau'
  })
  @ApiBody({ type: JobSearchDto })
  @ApiResponse({
    status: 200,
    description: 'Tìm kiếm thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Tìm kiếm thành công',
        content: {
          data: [
            {
              id: 1,
              ten_cong_viec: 'Thiết kế website responsive',
              danh_gia: 5,
              gia_tien: 2000000,
              hinh_anh: 'website-design.jpg',
              mo_ta: 'Thiết kế website responsive chuyên nghiệp',
              ma_chi_tiet_loai: 1,
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
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const { page: validPage, size: validSize } = this.jobsService.validatePagination(page, size);
    const result = await this.jobsService.searchJobs(searchDto, validPage, validSize);
    
    return this.createPaginatedResponse(
      result.data,
      result.pagination,
      'Tìm kiếm thành công'
    );
  }
}
