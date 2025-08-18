import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
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
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseController } from '../../common/base';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController extends BaseController {
  constructor(private readonly commentsService: CommentsService) {
    super();
  }

  @Get(':jobId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy bình luận của công việc',
    description: 'Lấy tất cả bình luận của một công việc cụ thể'
  })
  @ApiParam({
    name: 'jobId',
    description: 'ID công việc',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy bình luận thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy bình luận thành công',
        content: [
          {
            id: 1,
            ma_cong_viec: 1,
            ma_nguoi_binh_luan: 1,
            ngay_binh_luan: '2024-01-15T10:00:00.000Z',
            noi_dung: 'Công việc rất tốt, tôi rất hài lòng!',
            sao_binh_luan: 5,
            nguoiBinhLuan: {
              id: 1,
              name: 'Nguyễn Văn A',
              email: 'nguyenvana@email.com'
            }
          }
        ],
        dateTime: '2024-01-20T10:30:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Công việc không tồn tại'
  })
  async getCommentsByJobId(@Param('jobId') jobId: number) {
    const comments = await this.commentsService.getCommentsByJobId(jobId);
    return this.createSuccessResponse(
      comments,
      'Lấy bình luận thành công'
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo bình luận mới',
    description: 'Tạo bình luận mới cho công việc (yêu cầu đăng nhập)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: 'Tạo bình luận thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo bình luận thành công',
        content: {
          id: 2,
          ma_cong_viec: 1,
          ma_nguoi_binh_luan: 2,
          ngay_binh_luan: '2024-01-20T10:30:00.000Z',
          noi_dung: 'Tôi rất hài lòng với kết quả',
          sao_binh_luan: 5,
          nguoiBinhLuan: {
            id: 2,
            name: 'Trần Thị B',
            email: 'tranthib@email.com'
          }
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
  async createComment(@Body() createCommentDto: CreateCommentDto, @Request() req: any) {
    const comment = await this.commentsService.createComment(createCommentDto, req.user.userId);
    return this.createCreatedResponse(
      comment,
      'Tạo bình luận thành công'
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật bình luận',
    description: 'Cập nhật nội dung bình luận (yêu cầu đăng nhập và quyền sở hữu)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID bình luận cần cập nhật',
    type: Number,
    example: 1
  })
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({
    description: 'Cập nhật bình luận thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật bình luận thành công',
        content: {
          id: 1,
          ma_cong_viec: 1,
          ma_nguoi_binh_luan: 1,
          ngay_binh_luan: '2024-01-15T10:00:00.000Z',
          noi_dung: 'Công việc rất tốt, tôi rất hài lòng! (Đã cập nhật)',
          sao_binh_luan: 5,
          nguoiBinhLuan: {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@email.com'
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
    description: 'Không có quyền cập nhật bình luận này'
  })
  @ApiNotFoundResponse({
    description: 'Bình luận không tồn tại'
  })
  async updateComment(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: any,
  ) {
    const comment = await this.commentsService.updateComment(id, updateCommentDto, req.user);
    return this.createUpdatedResponse(
      comment,
      'Cập nhật bình luận thành công'
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa bình luận',
    description: 'Xóa bình luận (yêu cầu đăng nhập và quyền sở hữu)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID bình luận cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa bình luận thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa bình luận thành công',
        content: {
          message: 'Xóa bình luận thành công'
        },
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
  async deleteComment(@Param('id') id: number, @Request() req: any) {
    await this.commentsService.deleteComment(id, req.user);
    return this.createDeletedResponse('Xóa bình luận thành công');
  }
}
