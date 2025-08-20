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
@Controller('hiring')
export class HiringController {
  constructor(private readonly hiringService: HiringService) {}
  @Get('hired')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc đã thuê (cho client)',
    description: 'Lấy danh sách công việc mà client đã thuê',
  })
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
    description: 'Trạng thái công việc (completed, pending)',
    type: String,
    example: 'pending',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc đã thuê thành công',
  })
  async getHiredJobs(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('size') size?: number,
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
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc được thuê thành công',
  })
  async getFreelancerJobs(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const result = await this.hiringService.getFreelancerJobs(
      userId,
      page || 1,
      size || 10,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách công việc được thuê thành công',
      ...result,
    };
  }

  @Post()
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Thuê công việc',
    description: 'Thuê một công việc từ freelancer',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ma_cong_viec: { type: 'number', example: 1 },
        ma_nguoi_thue: { type: 'number', example: 1 },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Thuê công việc thành công',
  })
  async hireJob(@Body() createHiringDto: any, @Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const hiring = await this.hiringService.hireJob(
      createHiringDto.ma_cong_viec,
      userId,
    );
    return {
      statusCode: 201,
      message: 'Thuê công việc thành công',
      data: hiring,
    };
  }

  @Put(':id/complete')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đánh dấu hoàn thành công việc',
    description:
      'Đánh dấu công việc đã hoàn thành (chỉ freelancer mới có quyền)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID công việc được thuê',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Đánh dấu hoàn thành thành công',
  })
  async completeJob(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const hiring = await this.hiringService.completeJob(id, userId);
    return {
      statusCode: 200,
      message: 'Đánh dấu hoàn thành thành công',
      data: hiring,
    };
  }

  @Put(':id/cancel')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Hủy thuê công việc',
    description: 'Hủy thuê công việc (chỉ người thuê mới có quyền)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID công việc được thuê',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Hủy thuê công việc thành công',
  })
  async cancelHiring(@Param('id') id: number, @Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const result = await this.hiringService.cancelHiring(id, userId);
    return {
      statusCode: 200,
      message: 'Hủy thuê công việc thành công',
      data: result,
    };
  }

  @Get(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết công việc được thuê',
    description: 'Lấy thông tin chi tiết về một công việc được thuê',
  })
  @ApiParam({
    name: 'id',
    description: 'ID công việc được thuê',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin công việc được thuê thành công',
  })
  async getHiringById(@Param('id') id: number, @Request() req: any) {
    const hiring = await this.hiringService.getHiringById(id);
    return {
      statusCode: 200,
      message: 'Lấy thông tin công việc được thuê thành công',
      data: hiring,
    };
  }
}
