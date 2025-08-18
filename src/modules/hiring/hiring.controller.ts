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
import { HiringService } from './hiring.service';
import { CreateHiringDto, UpdateHiringDto } from './dto/hiring.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseController } from '../../common/base';

@ApiTags('Hiring')
@Controller('hiring')
export class HiringController extends BaseController {
  constructor(private readonly hiringService: HiringService) {
    super();
  }

  @Get('hired')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc đã thuê (cho client)',
    description: 'Lấy danh sách công việc mà client đã thuê'
  })
  @ApiBearerAuth('JWT-auth')
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
    name: 'status',
    required: false,
    description: 'Trạng thái công việc (completed, pending)',
    type: String,
    example: 'pending'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc đã thuê thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách công việc đã thuê thành công',
        content: {
          data: [
            {
              id: 1,
              ma_cong_viec: 1,
              ma_nguoi_thue: 2,
              ngay_thue: '2024-01-15T10:00:00.000Z',
              hoan_thanh: false,
              congViec: {
                id: 1,
                ten_cong_viec: 'Thiết kế website responsive',
                gia_tien: 2000000,
                hinh_anh: 'website-design.jpg'
              },
              nguoiThue: {
                id: 2,
                name: 'Trần Thị B',
                email: 'tranthib@email.com'
              }
            }
          ],
          pagination: {
            page: 1,
            size: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/hiring/hired',
        method: 'GET'
      }
    }
  })
  async getHiredJobs(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('size') size?: number,
    @Query('status') status?: string
  ) {
    const { page: validPage, size: validSize } = this.hiringService.validatePagination(page || 1, size || 10);
    const result = await this.hiringService.getHiredJobs(req.user.userId, validPage, validSize, status);
    
    return this.createPaginatedResponse(
      result.data,
      result.pagination,
      'Lấy danh sách công việc đã thuê thành công'
    );
  }

  @Get('freelancer')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc được thuê (cho freelancer)',
    description: 'Lấy danh sách công việc mà freelancer đang thực hiện'
  })
  @ApiBearerAuth('JWT-auth')
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
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc được thuê thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách công việc được thuê thành công',
        content: {
          data: [
            {
              id: 1,
              ma_cong_viec: 1,
              ma_nguoi_thue: 2,
              ngay_thue: '2024-01-15T10:00:00.000Z',
              hoan_thanh: false,
              congViec: {
                id: 1,
                ten_cong_viec: 'Thiết kế website responsive',
                gia_tien: 2000000,
                hinh_anh: 'website-design.jpg'
              },
              nguoiThue: {
                id: 2,
                name: 'Trần Thị B',
                email: 'tranthib@email.com'
              }
            }
          ],
          pagination: {
            page: 1,
            size: 10,
            total: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/hiring/freelancer',
        method: 'GET'
      }
    }
  })
  async getFreelancerJobs(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('size') size?: number
  ) {
    const { page: validPage, size: validSize } = this.hiringService.validatePagination(page || 1, size || 10);
    const result = await this.hiringService.getFreelancerJobs(req.user.userId, validPage, validSize);
    
    return this.createPaginatedResponse(
      result.data,
      result.pagination,
      'Lấy danh sách công việc được thuê thành công'
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Thuê công việc',
    description: 'Thuê một công việc từ freelancer'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateHiringDto })
  @ApiCreatedResponse({
    description: 'Thuê công việc thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Thuê công việc thành công',
        content: {
          id: 1,
          ma_cong_viec: 1,
          ma_nguoi_thue: 1,
          ngay_thue: '2024-01-20T10:30:00.000Z',
          hoan_thanh: false,
          congViec: {
            id: 1,
            ten_cong_viec: 'Thiết kế website responsive',
            gia_tien: 2000000
          }
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/hiring',
        method: 'POST'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ'
  })
  async hireJob(@Body() createHiringDto: CreateHiringDto, @Request() req: any) {
    const hiring = await this.hiringService.hireJob(createHiringDto, req.user.userId);
    return this.createCreatedResponse(
      hiring,
      'Thuê công việc thành công'
    );
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đánh dấu hoàn thành công việc',
    description: 'Đánh dấu công việc đã hoàn thành (chỉ freelancer mới có quyền)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID công việc được thuê',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Đánh dấu hoàn thành thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Đánh dấu hoàn thành thành công',
        content: {
          id: 1,
          ma_cong_viec: 1,
          ma_nguoi_thue: 2,
          ngay_thue: '2024-01-15T10:00:00.000Z',
          hoan_thanh: true
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/hiring/1/complete',
        method: 'PUT'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền đánh dấu hoàn thành công việc này'
  })
  @ApiNotFoundResponse({
    description: 'Công việc được thuê không tồn tại'
  })
  async completeJob(@Param('id') id: number, @Request() req: any) {
    const hiring = await this.hiringService.completeJob(id, req.user.userId);
    return this.createUpdatedResponse(
      hiring,
      'Đánh dấu hoàn thành thành công'
    );
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hủy thuê công việc',
    description: 'Hủy thuê công việc (chỉ người thuê mới có quyền)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID công việc được thuê',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Hủy thuê công việc thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hủy thuê công việc thành công',
        content: {
          message: 'Hủy thuê công việc thành công'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/hiring/1/cancel',
        method: 'PUT'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền hủy thuê công việc này'
  })
  @ApiNotFoundResponse({
    description: 'Công việc được thuê không tồn tại'
  })
  async cancelHiring(@Param('id') id: number, @Request() req: any) {
    await this.hiringService.cancelHiring(id, req.user.userId);
    return this.createSuccessResponse(
      { message: 'Hủy thuê công việc thành công' },
      'Hủy thuê công việc thành công'
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết công việc được thuê',
    description: 'Lấy thông tin chi tiết về một công việc được thuê'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID công việc được thuê',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin công việc được thuê thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin công việc được thuê thành công',
        content: {
          id: 1,
          ma_cong_viec: 1,
          ma_nguoi_thue: 1,
          ngay_thue: '2024-01-15T10:00:00.000Z',
          hoan_thanh: false,
          congViec: {
            id: 1,
            ten_cong_viec: 'Thiết kế website responsive',
            gia_tien: 2000000,
            hinh_anh: 'website-design.jpg',
            mo_ta: 'Thiết kế website responsive chuyên nghiệp'
          },
          nguoiThue: {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com'
          }
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/hiring/1',
        method: 'GET'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Công việc được thuê không tồn tại'
  })
  async getHiringById(@Param('id') id: number, @Request() req: any) {
    const hiring = await this.hiringService.getHiringById(id, req.user.userId);
    return this.createSuccessResponse(
      hiring,
      'Lấy thông tin công việc được thuê thành công'
    );
  }
}
