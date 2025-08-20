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
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import {
  CreateJobDto,
  UpdateJobDto,
  JobResponseDto,
  JobSearchDto,
} from './dto/jobs.dto';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách công việc',
    description: 'Lấy danh sách tất cả công việc có sẵn',
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
    name: 'category',
    required: false,
    description: 'ID danh mục',
    type: Number,
    example: 1,
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
    @Query('category', new ParseIntPipe({ optional: true })) category?: number,
  ) {
    const result = await this.jobsService.findAll(
      page || 1,
      size || 10,
      search,
      category,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách công việc thành công',
      ...result,
    };
  }

  @Get('categories/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục công việc',
    description: 'Lấy tất cả danh mục và chi tiết danh mục công việc',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục thành công',
  })
  async getJobCategories() {
    const categories = await this.jobsService.getJobCategories();
    return {
      statusCode: 200,
      message: 'Lấy danh mục thành công',
      data: categories,
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
    description: 'Lấy thông tin công việc thành công',
    type: JobResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  async getJobById(@Param('id', ParseIntPipe) id: number) {
    const job = await this.jobsService.findById(id);
    return {
      statusCode: 200,
      message: 'Lấy thông tin công việc thành công',
      data: job,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo công việc mới',
    description: 'Tạo một công việc mới',
  })
  @ApiBody({ type: CreateJobDto })
  @ApiCreatedResponse({
    description: 'Tạo công việc thành công',
    type: JobResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật công việc',
    description: 'Cập nhật thông tin công việc',
  })
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
  @ApiNotFoundResponse({
    description: 'Công việc không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật công việc này',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa công việc',
    description: 'Xóa một công việc',
  })
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
  async deleteJob(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    await this.jobsService.remove(id, userId);
    return {
      statusCode: 200,
      message: 'Xóa công việc thành công',
      data: { id },
    };
  }

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tìm kiếm công việc nâng cao',
    description: 'Tìm kiếm công việc với nhiều tiêu chí khác nhau',
  })
  @ApiBody({ type: JobSearchDto })
  @ApiResponse({
    status: 200,
    description: 'Tìm kiếm thành công',
    type: JobResponseDto,
    isArray: true,
  })
  async searchJobs(
    @Body() searchDto: JobSearchDto,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.jobsService.searchJobs(
      searchDto,
      page || 1,
      size || 10,
    );
    return {
      statusCode: 200,
      message: 'Tìm kiếm thành công',
      ...result,
    };
  }
}
