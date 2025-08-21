import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
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

@ApiTags('Hiring')
@Controller('thue-cong-viec')
export class HiringController {
  constructor(private readonly hiringService: HiringService) {}

  @Get()
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách thuê công việc',
    description: 'Lấy tất cả công việc đã thuê với phân trang',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Trạng thái công việc (pending, in_progress, completed, cancelled)',
    type: String,
    example: 'pending',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách thuê công việc thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getAllHiredJobs(
    @Request() req: any,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('status') status?: string,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const result = await this.hiringService.getAllHiredJobs(
      userId,
      page || 1,
      size || 10,
      status,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách thuê công việc thành công',
      ...result,
    };
  }

  @Get('hired')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc đã thuê (cho client)',
    description: 'Lấy danh sách công việc mà client đã thuê',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Trạng thái công việc (pending, in_progress, completed, cancelled)',
    type: String,
    example: 'pending',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc đã thuê thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getHiredJobs(
    @Request() req: any,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('status') status?: string,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const result = await this.hiringService.getHiredJobs(
      userId,
      page || 1,
      size || 10,
      status,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách công việc đã thuê thành công',
      ...result,
    };
  }

  @Get('freelancer')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc được thuê (cho freelancer)',
    description: 'Lấy danh sách công việc mà freelancer đang thực hiện',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Trạng thái công việc (pending, in_progress, completed, cancelled)',
    type: String,
    example: 'in_progress',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc được thuê thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getFreelancerJobs(
    @Request() req: any,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('status') status?: string,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const result = await this.hiringService.getFreelancerJobs(
      userId,
      page || 1,
      size || 10,
      status,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách công việc được thuê thành công',
      ...result,
    };
  }

  @Get(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết thuê công việc',
    description: 'Lấy thông tin chi tiết về một công việc đã thuê',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID thuê công việc',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết thuê công việc thành công',
  })
  @ApiNotFoundResponse({
    description: 'Thuê công việc không tồn tại',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getHiredJobById(@Param('id', ParseIntPipe) id: number) {
    const hiredJob = await this.hiringService.getHiredJobById(id);
    return {
      statusCode: 200,
      message: 'Lấy chi tiết thuê công việc thành công',
      data: hiredJob,
    };
  }

  @Post()
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Thuê công việc',
    description: 'Thuê một công việc mới',
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ma_cong_viec: {
          type: 'number',
          description: 'ID công việc',
          example: 1,
        },
        ma_nguoi_thue: {
          type: 'number',
          description: 'ID người thuê (tự động lấy từ token)',
          example: 1,
        },
      },
      required: ['ma_cong_viec'],
    },
  })
  @ApiCreatedResponse({
    description: 'Thuê công việc thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ hoặc công việc đã được thuê',
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async hireJob(
    @Body() body: { ma_cong_viec: number },
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const hiredJob = await this.hiringService.hireJob(body.ma_cong_viec, userId);
    return {
      statusCode: 201,
      message: 'Thuê công việc thành công',
      data: hiredJob,
    };
  }

  @Put(':id/status')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật trạng thái công việc',
    description: 'Cập nhật trạng thái của một công việc đã thuê',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID thuê công việc',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Trạng thái mới (pending, in_progress, completed, cancelled)',
          example: 'in_progress',
        },
        hoan_thanh: {
          type: 'boolean',
          description: 'Đánh dấu hoàn thành',
          example: false,
        },
        ghi_chu: {
          type: 'string',
          description: 'Ghi chú về trạng thái',
          example: 'Đang thực hiện',
        },
      },
      required: ['status'],
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật trạng thái thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Thuê công việc không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật trạng thái',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async updateJobStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      status: string;
      hoan_thanh?: boolean;
      ghi_chu?: string;
    },
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const updatedJob = await this.hiringService.updateJobStatus(
      id,
      body,
      userId,
    );
    return {
      statusCode: 200,
      message: 'Cập nhật trạng thái thành công',
      data: updatedJob,
    };
  }

  @Put(':id/complete')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đánh dấu hoàn thành công việc',
    description: 'Đánh dấu một công việc đã hoàn thành',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID thuê công việc',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        danh_gia: {
          type: 'number',
          description: 'Đánh giá sao (1-5)',
          example: 5,
        },
        nhan_xet: {
          type: 'string',
          description: 'Nhận xét về công việc',
          example: 'Công việc rất tốt',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Đánh dấu hoàn thành thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Thuê công việc không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền đánh dấu hoàn thành',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async completeJob(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      danh_gia?: number;
      nhan_xet?: string;
    },
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const completedJob = await this.hiringService.completeJob(
      id,
      body,
      userId,
    );
    return {
      statusCode: 200,
      message: 'Đánh dấu hoàn thành thành công',
      data: completedJob,
    };
  }

  @Delete(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hủy thuê công việc',
    description: 'Hủy một công việc đã thuê',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID thuê công việc',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Hủy thuê công việc thành công',
  })
  @ApiNotFoundResponse({
    description: 'Thuê công việc không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền hủy thuê công việc này',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async cancelHiredJob(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    await this.hiringService.cancelHiredJob(id, userId);
    return {
      statusCode: 200,
      message: 'Hủy thuê công việc thành công',
    };
  }

  @Get('statistics/overview')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thống kê tổng quan thuê công việc',
    description: 'Lấy thống kê tổng quan về các công việc đã thuê',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getHiringStatistics(@Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const stats = await this.hiringService.getStatistics(userId);
    return {
      statusCode: 200,
      message: 'Lấy thống kê thành công',
      data: stats,
    };
  }
}
