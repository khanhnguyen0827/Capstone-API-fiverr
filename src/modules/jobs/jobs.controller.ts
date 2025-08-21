import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import {
  CreateJobDto,
  UpdateJobDto,
  JobResponseDto,
} from './dto/jobs.dto';

@ApiTags('Jobs')
@Controller('cong-viec')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc',
    description: 'Lấy danh sách tất cả công việc có sẵn với tìm kiếm và lọc',
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
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm',
    type: String,
    example: 'website',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID danh mục',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Giá tối thiểu',
    type: Number,
    example: 100000,
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Giá tối đa',
    type: Number,
    example: 1000000,
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    description: 'Đánh giá sao tối thiểu',
    type: Number,
    example: 4,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sắp xếp theo (price, rating, date)',
    type: String,
    example: 'price',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Thứ tự sắp xếp (asc, desc)',
    type: String,
    example: 'desc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách công việc thành công',
    type: JobResponseDto,
    isArray: true,
  })
  async getJobs(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('search') search?: string,
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
    @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
    @Query('rating', new ParseIntPipe({ optional: true })) rating?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    const result = await this.jobsService.findAll(
      page || 1,
      size || 10,
      search,
      categoryId,
      minPrice,
      maxPrice,
      rating,
      sortBy,
      sortOrder,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách công việc thành công',
      ...result,
    };
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tìm kiếm công việc nâng cao',
    description: 'Tìm kiếm công việc với nhiều tiêu chí',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Từ khóa tìm kiếm',
    type: String,
    example: 'website responsive',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    description: 'Địa điểm',
    type: String,
    example: 'Hanoi',
  })
  @ApiQuery({
    name: 'skills',
    required: false,
    description: 'Kỹ năng cần thiết',
    type: String,
    example: 'React,Node.js',
  })
  @ApiResponse({
    status: 200,
    description: 'Tìm kiếm thành công',
    type: JobResponseDto,
    isArray: true,
  })
  async searchJobs(
    @Query('q') query: string,
    @Query('location') location?: string,
    @Query('skills') skills?: string,
  ) {
    const result = await this.jobsService.searchJobs(query, location, skills);
    return {
      statusCode: 200,
      message: 'Tìm kiếm thành công',
      data: result,
    };
  }

  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thống kê công việc',
    description: 'Lấy thống kê tổng quan về công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getJobStatistics() {
    const stats = await this.jobsService.getStatistics();
    return {
      statusCode: 200,
      message: 'Lấy thống kê thành công',
      data: stats,
    };
  }

  @Get('featured')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Công việc nổi bật',
    description: 'Lấy danh sách công việc nổi bật',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng công việc (mặc định: 6)',
    type: Number,
    example: 6,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy công việc nổi bật thành công',
    type: JobResponseDto,
    isArray: true,
  })
  async getFeaturedJobs(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const jobs = await this.jobsService.getFeaturedJobs(limit || 6);
    return {
      statusCode: 200,
      message: 'Lấy công việc nổi bật thành công',
      data: jobs,
    };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy công việc theo người tạo',
    description: 'Lấy danh sách công việc được tạo bởi một người dùng',
  })
  @ApiParam({
    name: 'userId',
    description: 'ID người dùng',
    type: Number,
    example: 1,
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
    description: 'Lấy công việc theo người tạo thành công',
    type: JobResponseDto,
    isArray: true,
  })
  async getJobsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.jobsService.findByUser(
      userId,
      page || 1,
      size || 10,
    );
    return {
      statusCode: 200,
      message: 'Lấy công việc theo người tạo thành công',
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết công việc',
    description: 'Lấy thông tin chi tiết về một công việc',
  })
  @ApiParam({
    name: 'id',
    description: 'ID công việc',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết công việc thành công',
    type: JobResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  async getJobById(@Param('id', ParseIntPipe) id: number) {
    const job = await this.jobsService.findById(id);
    return {
      statusCode: 200,
      message: 'Lấy chi tiết công việc thành công',
      data: job,
    };
  }

  @Post()
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo công việc mới',
    description: 'Tạo một công việc mới',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateJobDto })
  @ApiCreatedResponse({
    description: 'Tạo công việc thành công',
    type: JobResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo công việc',
  })
  async createJob(@Body() createJobDto: CreateJobDto, @Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const job = await this.jobsService.create(createJobDto, userId);
    return {
      statusCode: 201,
      message: 'Tạo công việc thành công',
      data: job,
    };
  }

  @Put(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật công việc',
    description: 'Cập nhật thông tin một công việc',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID công việc',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateJobDto })
  @ApiOkResponse({
    description: 'Cập nhật công việc thành công',
    type: JobResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật công việc này',
  })
  async updateJob(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const job = await this.jobsService.update(id, updateJobDto, userId);
    return {
      statusCode: 200,
      message: 'Cập nhật công việc thành công',
      data: job,
    };
  }

  @Delete(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa công việc',
    description: 'Xóa một công việc',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID công việc',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Xóa công việc thành công',
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa công việc này',
  })
  async deleteJob(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    await this.jobsService.remove(id, userId);
    return {
      statusCode: 200,
      message: 'Xóa công việc thành công',
    };
  }

  @Post(':id/apply')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Ứng tuyển công việc',
    description: 'Ứng tuyển vào một công việc',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID công việc',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Ứng tuyển thành công',
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  @ApiBadRequestResponse({
    description: 'Đã ứng tuyển công việc này',
  })
  async applyForJob(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    await this.jobsService.applyForJob(id, userId);
    return {
      statusCode: 200,
      message: 'Ứng tuyển thành công',
    };
  }

  @Get(':id/applicants')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách ứng viên',
    description: 'Lấy danh sách người ứng tuyển cho một công việc',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID công việc',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách ứng viên thành công',
  })
  async getJobApplicants(@Param('id', ParseIntPipe) id: number) {
    const applicants = await this.jobsService.getApplicants(id);
    return {
      statusCode: 200,
      message: 'Lấy danh sách ứng viên thành công',
      data: applicants,
    };
  }
}
