import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':jobId')
  @ApiOperation({
    summary: 'Lấy bình luận của công việc',
    description: 'Lấy danh sách tất cả bình luận của một công việc cụ thể'
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID của công việc',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Lấy bình luận thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy bình luận thành công',
        content: [
          {
            id: 1,
            noi_dung: 'Dự án rất tốt!',
            sao_binh_luan: 5,
            ngay_binh_luan: '2024-01-20T10:30:00.000Z',
            ma_cong_viec: 1,
            ma_nguoi_binh_luan: 1,
            nguoiBinhLuan: {
              id: 1,
              name: 'Nguyễn Văn A',
              email: 'user@example.com'
            }
          }
        ],
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  async getCommentsByJobId(@Param('jobId') jobId: string) {
    const result = await this.commentsService.getCommentsByJobId(parseInt(jobId));
    return {
      statusCode: 200,
      message: 'Lấy bình luận thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Thêm bình luận mới',
    description: 'Thêm bình luận mới cho một công việc (cần xác thực)'
  })
  @ApiCreatedResponse({
    description: 'Thêm bình luận thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Thêm bình luận thành công',
        content: {
          id: 2,
          noi_dung: 'Dự án rất chuyên nghiệp!',
          sao_binh_luan: 5,
          ngay_binh_luan: '2024-01-20T10:30:00.000Z',
          ma_cong_viec: 1,
          ma_nguoi_binh_luan: 2,
          nguoiBinhLuan: {
            id: 2,
            name: 'Trần Thị B',
            email: 'user2@example.com'
          }
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  async createComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const result = await this.commentsService.createComment(createCommentDto, req.user.userId);
    return {
      statusCode: 201,
      message: 'Thêm bình luận thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Sửa bình luận',
    description: 'Sửa bình luận (cần xác thực và quyền sở hữu)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bình luận cần sửa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Sửa bình luận thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Sửa bình luận thành công',
        content: {
          id: 1,
          noi_dung: 'Dự án rất tốt và chuyên nghiệp!',
          sao_binh_luan: 5,
          ngay_binh_luan: '2024-01-20T10:30:00.000Z',
          ma_cong_viec: 1,
          ma_nguoi_binh_luan: 1,
          nguoiBinhLuan: {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'user@example.com'
          }
        },
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền sửa bình luận này'
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại'
  })
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const result = await this.commentsService.updateComment(parseInt(id), updateCommentDto, req.user);
    return {
      statusCode: 200,
      message: 'Sửa bình luận thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa bình luận',
    description: 'Xóa bình luận (cần xác thực và quyền sở hữu)'
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bình luận cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa bình luận thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa bình luận thành công',
        content: null,
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa bình luận này'
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại'
  })
  async deleteComment(@Param('id') id: string, @Request() req) {
    await this.commentsService.deleteComment(parseInt(id), req.user);
    return {
      statusCode: 200,
      message: 'Xóa bình luận thành công',
      content: null,
      dateTime: new Date().toISOString(),
    };
  }
}
