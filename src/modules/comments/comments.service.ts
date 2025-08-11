import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getCommentsByJobId(jobId: number) {
    const comments = await this.prisma.binhLuan.findMany({
      where: { ma_cong_viec: jobId },
      include: {
        nguoiBinhLuan: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        ngay_binh_luan: 'desc'
      }
    });

    return comments;
  }

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const newComment = await this.prisma.binhLuan.create({
      data: {
        ...createCommentDto,
        ma_nguoi_binh_luan: userId,
        ngay_binh_luan: new Date()
      },
      include: {
        nguoiBinhLuan: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return newComment;
  }

  async updateComment(id: number, updateCommentDto: UpdateCommentDto, currentUser: any) {
    const comment = await this.prisma.binhLuan.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Bình luận không tồn tại');
    }

    // Kiểm tra quyền sở hữu
    if (comment.ma_nguoi_binh_luan !== currentUser.userId && currentUser.role !== 'admin') {
      throw new ForbiddenException('Không có quyền cập nhật bình luận này');
    }

    const updatedComment = await this.prisma.binhLuan.update({
      where: { id },
      data: updateCommentDto,
      include: {
        nguoiBinhLuan: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedComment;
  }

  async deleteComment(id: number, currentUser: any) {
    const comment = await this.prisma.binhLuan.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Bình luận không tồn tại');
    }

    // Kiểm tra quyền sở hữu
    if (comment.ma_nguoi_binh_luan !== currentUser.userId && currentUser.role !== 'admin') {
      throw new ForbiddenException('Không có quyền xóa bình luận này');
    }

    await this.prisma.binhLuan.delete({
      where: { id },
    });

    return { message: 'Xóa bình luận thành công' };
  }
}
