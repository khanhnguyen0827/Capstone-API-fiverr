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
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  UpdateCommentDto,
  CommentResponseDto,
} from './dto/comments.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo bình luận mới',
    description: 'Tạo một bình luận mới cho công việc',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: 'Tạo bình luận thành công',
    type: CommentResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật bình luận',
    description: 'Cập nhật nội dung bình luận',
  })
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
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật bình luận này',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa bình luận',
    description: 'Xóa một bình luận',
  })
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
      data: { id },
    };
  }
}
