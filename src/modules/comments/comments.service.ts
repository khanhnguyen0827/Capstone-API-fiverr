import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { USER_ROLES, RESPONSE_MESSAGES } from '../../common/constant/app.constant';

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
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    // Kiểm tra quyền sở hữu
    if (comment.ma_nguoi_binh_luan !== currentUser.userId && currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException(RESPONSE_MESSAGES.FORBIDDEN);
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
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    // Kiểm tra quyền sở hữu
    if (comment.ma_nguoi_binh_luan !== currentUser.userId && currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException(RESPONSE_MESSAGES.FORBIDDEN);
    }

    await this.prisma.binhLuan.delete({
      where: { id },
    });

    return { message: RESPONSE_MESSAGES.DELETED };
  }
}
