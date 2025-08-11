import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobSearchDto } from './dto/jobs.dto';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async getJobs(page: number, size: number, search?: string, category?: string) {
    const skip = (page - 1) * size;
    
    const where: any = {};
    
    if (search) {
      where.ten_cong_viec = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    if (category) {
      where.ma_chi_tiet_loai = parseInt(category);
    }

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where,
        skip,
        take: size,
        include: {
          chiTietLoaiCongViec: {
            include: {
              loaiCongViec: true
            }
          },
          nguoiTao: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      }),
      this.prisma.congViec.count({ where })
    ]);

    return {
      data: jobs,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  async getJobById(id: number) {
    const job = await this.prisma.congViec.findUnique({
      where: { id },
      include: {
        chiTietLoaiCongViec: {
          include: {
            loaiCongViec: true
          }
        },
        nguoiTao: {
          select: {
            id: true,
            name: true,
            email: true,
            skill: true,
            certification: true
          }
        }
      }
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    return job;
  }

  async createJob(createJobDto: CreateJobDto, userId: number) {
    const newJob = await this.prisma.congViec.create({
      data: {
        ...createJobDto,
        nguoi_tao: userId,
        danh_gia: 0,
        sao_cong_viec: 0
      },
      include: {
        chiTietLoaiCongViec: true,
        nguoiTao: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return newJob;
  }

  async updateJob(id: number, updateJobDto: UpdateJobDto, currentUser: any) {
    const job = await this.prisma.congViec.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    // Kiểm tra quyền sở hữu
    if (job.nguoi_tao !== currentUser.userId && currentUser.role !== 'admin') {
      throw new ForbiddenException('Không có quyền cập nhật công việc này');
    }

    const updatedJob = await this.prisma.congViec.update({
      where: { id },
      data: updateJobDto,
      include: {
        chiTietLoaiCongViec: true,
        nguoiTao: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return updatedJob;
  }

  async deleteJob(id: number, currentUser: any) {
    const job = await this.prisma.congViec.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    // Kiểm tra quyền sở hữu
    if (job.nguoi_tao !== currentUser.userId && currentUser.role !== 'admin') {
      throw new ForbiddenException('Không có quyền xóa công việc này');
    }

    await this.prisma.congViec.delete({
      where: { id },
    });

    return { message: 'Xóa công việc thành công' };
  }

  async getJobCategories() {
    const categories = await this.prisma.chiTietLoaiCongViec.findMany({
      include: {
        loaiCongViec: true
      },
      orderBy: {
        loaiCongViec: {
          id: 'asc'
        }
      }
    });

    return categories;
  }

  async searchJobs(searchDto: JobSearchDto, page: number = 1, size: number = 10) {
    const skip = (page - 1) * size;
    
    const where: any = {};
    
    if (searchDto.keyword) {
      where.ten_cong_viec = {
        contains: searchDto.keyword,
        mode: 'insensitive'
      };
    }
    
    if (searchDto.categoryId) {
      where.ma_chi_tiet_loai = searchDto.categoryId;
    }
    
    if (searchDto.minPrice || searchDto.maxPrice) {
      where.gia_tien = {};
      if (searchDto.minPrice) {
        where.gia_tien.gte = searchDto.minPrice;
      }
      if (searchDto.maxPrice) {
        where.gia_tien.lte = searchDto.maxPrice;
      }
    }
    
    if (searchDto.rating) {
      where.sao_cong_viec = {
        gte: searchDto.rating
      };
    }

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where,
        skip,
        take: size,
        include: {
          chiTietLoaiCongViec: {
            include: {
              loaiCongViec: true
            }
          },
          nguoiTao: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          id: 'desc'
        }
      }),
      this.prisma.congViec.count({ where })
    ]);

    return {
      data: jobs,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }
}
