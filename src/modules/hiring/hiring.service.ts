import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HiringService {
  constructor(private readonly prisma: PrismaService) {}

  async getHiredJobs(userId: number, page: number = 1, size: number = 10, status?: string) {
    const skip = (page - 1) * size;
    const where: any = { ma_nguoi_thue: userId };

    if (status === 'completed') {
      where.hoan_thanh = true;
    } else if (status === 'pending') {
      where.hoan_thanh = false;
    }

    const [hiredJobs, total] = await Promise.all([
      this.prisma.thueCongViec.findMany({
        where,
        skip,
        take: size,
        include: {
          CongViec: {
            include: {
              ChiTietLoaiCongViec: {
                include: {
                  LoaiCongViec: true,
                },
              },
              NguoiDung: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          ngay_thue: 'desc',
        },
      }),
      this.prisma.thueCongViec.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: hiredJobs,
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

  async getFreelancerJobs(userId: number, page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;

    const [freelancerJobs, total] = await Promise.all([
      this.prisma.thueCongViec.findMany({
        where: {
          CongViec: {
            nguoi_tao: userId,
          },
        },
        skip,
        take: size,
        include: {
          CongViec: {
            include: {
              ChiTietLoaiCongViec: {
                include: {
                  LoaiCongViec: true,
                },
              },
              NguoiDung: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          NguoiDung: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          ngay_thue: 'desc',
        },
      }),
      this.prisma.thueCongViec.count({
        where: {
          CongViec: {
            nguoi_tao: userId,
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: freelancerJobs,
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

  async hireJob(ma_cong_viec: number, ma_nguoi_thue: number) {
    // Kiểm tra công việc có tồn tại không
    const job = await this.prisma.congViec.findUnique({
      where: { id: ma_cong_viec },
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    // Kiểm tra người dùng có tồn tại không
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id: ma_nguoi_thue },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // Tạo thuê công việc
    const hiring = await this.prisma.thueCongViec.create({
      data: {
        ma_cong_viec,
        ma_nguoi_thue,
        ngay_thue: new Date(),
        hoan_thanh: false,
      },
      include: {
        CongViec: {
          include: {
            ChiTietLoaiCongViec: {
              include: {
                LoaiCongViec: true,
              },
            },
            NguoiDung: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return hiring;
  }

  async completeJob(id: number, userId: number) {
    const hiring = await this.prisma.thueCongViec.findUnique({
      where: { id },
      include: {
        CongViec: true,
      },
    });

    if (!hiring) {
      throw new NotFoundException('Công việc được thuê không tồn tại');
    }

    // Chỉ freelancer (người tạo công việc) mới có quyền đánh dấu hoàn thành
    if (!hiring.CongViec || hiring.CongViec.nguoi_tao !== userId) {
      throw new ForbiddenException('Bạn không có quyền đánh dấu hoàn thành công việc này');
    }

    const updatedHiring = await this.prisma.thueCongViec.update({
      where: { id },
      data: { hoan_thanh: true },
      include: {
        CongViec: {
          include: {
            ChiTietLoaiCongViec: {
              include: {
                LoaiCongViec: true,
              },
            },
            NguoiDung: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedHiring;
  }

  async cancelHiring(id: number, userId: number) {
    const hiring = await this.prisma.thueCongViec.findUnique({
      where: { id },
    });

    if (!hiring) {
      throw new NotFoundException('Công việc được thuê không tồn tại');
    }

    // Chỉ người thuê mới có quyền hủy
    if (hiring.ma_nguoi_thue !== userId) {
      throw new ForbiddenException('Bạn không có quyền hủy thuê công việc này');
    }

    await this.prisma.thueCongViec.delete({
      where: { id },
    });

    return { id, message: 'Hủy thuê công việc thành công' };
  }

  async getHiringById(id: number) {
    const hiring = await this.prisma.thueCongViec.findUnique({
      where: { id },
      include: {
        CongViec: {
          include: {
            ChiTietLoaiCongViec: {
              include: {
                LoaiCongViec: true,
              },
            },
            NguoiDung: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!hiring) {
      throw new NotFoundException('Công việc được thuê không tồn tại');
    }

    return hiring;
  }
}
