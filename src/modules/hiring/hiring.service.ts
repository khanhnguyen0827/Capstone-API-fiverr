import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class HiringService {
  constructor(private prisma: PrismaService) {}

  validatePagination(page: number, size: number) {
    const validPage = Math.max(1, page || 1);
    const validSize = Math.max(1, Math.min(100, size || 10));
    return { page: validPage, size: validSize };
  }

  async getHiredJobs(userId: number, page: number, size: number, status?: string) {
    const skip = (page - 1) * size;
    
    let whereClause: any = {
      ma_nguoi_thue: userId
    };

    if (status === 'completed') {
      whereClause.hoan_thanh = true;
    } else if (status === 'in_progress') {
      whereClause.hoan_thanh = false;
    }

    const [data, total] = await Promise.all([
      this.prisma.thueCongViec.findMany({
        where: whereClause,
        include: {
          congViec: {
            select: {
              id: true,
              ten_cong_viec: true,
              gia_tien: true,
              hinh_anh: true,
              mo_ta: true
            }
          }
        },
        skip,
        take: size,
        orderBy: { ngay_thue: 'desc' }
      }),
      this.prisma.thueCongViec.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(total / size);
    
    return {
      data,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async getFreelancerJobs(freelancerId: number, page: number, size: number) {
    const skip = (page - 1) * size;
    
    const [data, total] = await Promise.all([
      this.prisma.thueCongViec.findMany({
        where: {
          congViec: {
            nguoi_tao: freelancerId
          }
        },
        include: {
          congViec: {
            select: {
              id: true,
              ten_cong_viec: true,
              gia_tien: true,
              hinh_anh: true,
              mo_ta: true
            }
          },
          nguoiThue: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: size,
        orderBy: { ngay_thue: 'desc' }
      }),
      this.prisma.thueCongViec.count({
        where: {
          congViec: {
            nguoi_tao: freelancerId
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / size);
    
    return {
      data,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  async hireJob(createHiringDto: any, userId: number) {
    // Kiểm tra công việc có tồn tại không
    const job = await this.prisma.congViec.findUnique({
      where: { id: createHiringDto.ma_cong_viec }
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    // Kiểm tra xem người dùng đã thuê công việc này chưa
    const existingHiring = await this.prisma.thueCongViec.findFirst({
      where: {
        ma_cong_viec: createHiringDto.ma_cong_viec,
        ma_nguoi_thue: userId
      }
    });

    if (existingHiring) {
      throw new BadRequestException('Bạn đã thuê công việc này rồi');
    }

    // Tạo công việc được thuê
    const hiring = await this.prisma.thueCongViec.create({
      data: {
        ma_cong_viec: createHiringDto.ma_cong_viec,
        ma_nguoi_thue: userId,
        ngay_thue: new Date(),
        hoan_thanh: false
      },
      include: {
        congViec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
            mo_ta: true
          }
        }
      }
    });

    return hiring;
  }

  async completeJob(id: number, freelancerId: number) {
    const hiring = await this.prisma.thueCongViec.findUnique({
      where: { id },
      include: {
        congViec: true
      }
    });

    if (!hiring) {
      throw new NotFoundException('Công việc được thuê không tồn tại');
    }

    if (!hiring.congViec) {
      throw new NotFoundException('Thông tin công việc không tồn tại');
    }

    // Kiểm tra xem người dùng có phải là freelancer của công việc này không
    if (hiring.congViec.nguoi_tao !== freelancerId) {
      throw new ForbiddenException('Bạn không có quyền đánh dấu hoàn thành công việc này');
    }

    // Cập nhật trạng thái hoàn thành
    const updatedHiring = await this.prisma.thueCongViec.update({
      where: { id },
      data: { hoan_thanh: true },
      include: {
        congViec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
            mo_ta: true
          }
        }
      }
    });

    return updatedHiring;
  }

  async cancelHiring(id: number, userId: number) {
    const hiring = await this.prisma.thueCongViec.findUnique({
      where: { id }
    });

    if (!hiring) {
      throw new NotFoundException('Công việc được thuê không tồn tại');
    }

    // Kiểm tra xem người dùng có phải là người thuê công việc này không
    if (hiring.ma_nguoi_thue !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy thuê công việc này');
    }

    // Xóa công việc được thuê
    await this.prisma.thueCongViec.delete({
      where: { id }
    });

    return { message: 'Hủy thuê công việc thành công' };
  }

  async getHiringById(id: number, userId: number) {
    const hiring = await this.prisma.thueCongViec.findUnique({
      where: { id },
      include: {
        congViec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
            mo_ta: true,
            mo_ta_ngan: true,
            nguoi_tao: true
          }
        },
        nguoiThue: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!hiring) {
      throw new NotFoundException('Công việc được thuê không tồn tại');
    }

    if (!hiring.congViec) {
      throw new NotFoundException('Thông tin công việc không tồn tại');
    }

    // Kiểm tra quyền truy cập
    if (hiring.ma_nguoi_thue !== userId && hiring.congViec.nguoi_tao !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem thông tin công việc này');
    }

    return hiring;
  }
}
