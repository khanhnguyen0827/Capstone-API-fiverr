import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto, CommentResponseDto } from './dto/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    jobId?: number,
    page: number = 1,
    size: number = 10,
  ): Promise<{ data: CommentResponseDto[]; pagination: any }> {
    const skip = (page - 1) * size;

    const where = jobId ? { ma_cong_viec: jobId } : {};

    const [comments, total] = await Promise.all([
      this.prisma.binhLuan.findMany({
        where,
        skip,
        take: size,
        include: {
          NguoiDung: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          ngay_binh_luan: 'desc',
        },
      }),
      this.prisma.binhLuan.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: comments,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findByUser(
    userId: number,
    page: number = 1,
    size: number = 10,
  ): Promise<{ data: CommentResponseDto[]; pagination: any }> {
    const skip = (page - 1) * size;

    const [comments, total] = await Promise.all([
      this.prisma.binhLuan.findMany({
        where: { ma_nguoi_binh_luan: userId },
        skip,
        take: size,
        include: {
          CongViec: {
            select: {
              id: true,
              ten_cong_viec: true,
            },
          },
        },
        orderBy: {
          ngay_binh_luan: 'desc',
        },
      }),
      this.prisma.binhLuan.count({
        where: { ma_nguoi_binh_luan: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: comments,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: number): Promise<CommentResponseDto> {
    const comment = await this.prisma.binhLuan.findUnique({
      where: { id },
      include: {
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        CongViec: {
          select: {
            id: true,
            ten_cong_viec: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Bình luận với ID ${id} không tồn tại`);
    }

    return comment;
  }

  async create(
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<CommentResponseDto> {
    const comment = await this.prisma.binhLuan.create({
      data: {
        ...createCommentDto,
        ma_nguoi_binh_luan: userId,
        ngay_binh_luan: new Date(),
      },
      include: {
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return comment;
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    userId: number,
  ): Promise<CommentResponseDto> {
    const existingComment = await this.prisma.binhLuan.findUnique({
      where: { id },
      select: { ma_nguoi_binh_luan: true },
    });

    if (!existingComment) {
      throw new NotFoundException(`Bình luận với ID ${id} không tồn tại`);
    }

    if (existingComment.ma_nguoi_binh_luan !== userId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật bình luận này');
    }

    const comment = await this.prisma.binhLuan.update({
      where: { id },
      data: updateCommentDto,
      include: {
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return comment;
  }

  async remove(id: number, userId: number): Promise<void> {
    const existingComment = await this.prisma.binhLuan.findUnique({
      where: { id },
      select: { ma_nguoi_binh_luan: true },
    });

    if (!existingComment) {
      throw new NotFoundException(`Bình luận với ID ${id} không tồn tại`);
    }

    if (existingComment.ma_nguoi_binh_luan !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.prisma.binhLuan.delete({
      where: { id },
    });
  }

  async toggleLike(id: number, userId: number): Promise<{ liked: boolean }> {
    // Note: This is a placeholder implementation since the current schema doesn't support likes
    // You would need to add a likes table or modify the schema to support this feature
    const comment = await this.findById(id);
    
    // For now, return a mock response
    return { liked: true };
  }

  async getStatistics(jobId: number): Promise<any> {
    const [totalComments, avgRating, ratingDistribution] = await Promise.all([
      this.prisma.binhLuan.count({
        where: { ma_cong_viec: jobId },
      }),
      this.prisma.binhLuan.aggregate({
        where: { ma_cong_viec: jobId },
        _avg: { sao_binh_luan: true },
      }),
      this.prisma.binhLuan.groupBy({
        by: ['sao_binh_luan'],
        where: { ma_cong_viec: jobId },
        _count: true,
      }),
    ]);

    return {
      totalComments,
      averageRating: avgRating._avg.sao_binh_luan || 0,
      ratingDistribution,
    };
  }
}
