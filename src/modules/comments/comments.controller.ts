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
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponseDto,
} from './dto/comments.dto';

@ApiTags('Comments')
@Controller('binh-luan')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách bình luận',
    description: 'Lấy tất cả bình luận với phân trang',
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
    description: 'Lấy danh sách bình luận thành công',
    type: CommentResponseDto,
    isArray: true,
  })
  async getAllComments(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.commentsService.findAll(
      undefined,
      page || 1,
      size || 10,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách bình luận thành công',
      ...result,
    };
  }

  @Get('job/:jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy bình luận theo công việc',
    description: 'Lấy tất cả bình luận của một công việc',
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID công việc',
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
    description: 'Lấy bình luận thành công',
    type: CommentResponseDto,
    isArray: true,
  })
  async getCommentsByJob(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.commentsService.findAll(
      jobId,
      page || 1,
      size || 10,
    );
    return {
      statusCode: 200,
      message: 'Lấy bình luận thành công',
      ...result,
    };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy bình luận theo người dùng',
    description: 'Lấy tất cả bình luận của một người dùng',
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
    description: 'Lấy bình luận theo người dùng thành công',
    type: CommentResponseDto,
    isArray: true,
  })
  async getCommentsByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.commentsService.findByUser(
      userId,
      page || 1,
      size || 10,
    );
    return {
      statusCode: 200,
      message: 'Lấy bình luận theo người dùng thành công',
      ...result,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết bình luận',
    description: 'Lấy thông tin chi tiết về một bình luận',
  })
  @ApiParam({
    name: 'id',
    description: 'ID bình luận',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết bình luận thành công',
    type: CommentResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại',
  })
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentsService.findById(id);
    return {
      statusCode: 200,
      message: 'Lấy chi tiết bình luận thành công',
      data: comment,
    };
  }

  @Post()
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo bình luận mới',
    description: 'Tạo một bình luận mới cho công việc',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: 'Tạo bình luận thành công',
    type: CommentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo bình luận',
  })
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const comment = await this.commentsService.create(createCommentDto, userId);
    return {
      statusCode: 201,
      message: 'Tạo bình luận thành công',
      data: comment,
    };
  }

  @Put(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật bình luận',
    description: 'Cập nhật nội dung một bình luận',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID bình luận',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({
    description: 'Cập nhật bình luận thành công',
    type: CommentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật bình luận này',
  })
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const comment = await this.commentsService.update(
      id,
      updateCommentDto,
      userId,
    );
    return {
      statusCode: 200,
      message: 'Cập nhật bình luận thành công',
      data: comment,
    };
  }

  @Delete(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa bình luận',
    description: 'Xóa một bình luận',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID bình luận',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Xóa bình luận thành công',
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa bình luận này',
  })
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    await this.commentsService.remove(id, userId);
    return {
      statusCode: 200,
      message: 'Xóa bình luận thành công',
    };
  }

  @Post(':id/like')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thích bình luận',
    description: 'Thích hoặc bỏ thích một bình luận',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID bình luận',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Thao tác thành công',
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại',
  })
  async likeComment(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const result = await this.commentsService.toggleLike(id, userId);
    return {
      statusCode: 200,
      message: result.liked ? 'Đã thích bình luận' : 'Đã bỏ thích bình luận',
      data: result,
    };
  }

  @Get('job/:jobId/statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thống kê bình luận theo công việc',
    description: 'Lấy thống kê bình luận và đánh giá của một công việc',
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID công việc',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getCommentStatistics(@Param('jobId', ParseIntPipe) jobId: number) {
    const stats = await this.commentsService.getStatistics(jobId);
    return {
      statusCode: 200,
      message: 'Lấy thống kê thành công',
      data: stats,
    };
  }
}
