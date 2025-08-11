import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto } from './dto/jobs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
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

  @Get(':id')
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
