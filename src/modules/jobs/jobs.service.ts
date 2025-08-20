import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateJobDto,
  UpdateJobDto,
  JobResponseDto,
  JobSearchDto,
} from './dto/jobs.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
    category?: number,
  ) {
    const skip = (page - 1) * size;

    const where: any = {};

    if (search) {
      where.ten_cong_viec = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.ma_chi_tiet_loai = category;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where,
        skip,
        take: size,
        include: {
          chiTietLoaiCongViec: {
            include: {
              loaiCongViec: true,
            },
          },
          nguoiTao: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.congViec.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: jobs,
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

  async findById(id: number): Promise<JobResponseDto> {
    const job = await this.prisma.congViec.findUnique({
      where: { id },
      include: {
        chiTietLoaiCongViec: {
          include: {
            loaiCongViec: true,
          },
        },
        nguoiTao: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Công việc với ID ${id} không tồn tại`);
    }

    return job;
  }

  async create(
    createJobDto: CreateJobDto,
    userId: number,
  ): Promise<JobResponseDto> {
    const job = await this.prisma.congViec.create({
      data: {
        ...createJobDto,
        nguoi_tao: userId,
        danh_gia: 0,
        sao_cong_viec: 0,
      },
      include: {
        chiTietLoaiCongViec: {
          include: {
            loaiCongViec: true,
          },
        },
        nguoiTao: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return job;
  }

  async update(
    id: number,
    updateJobDto: UpdateJobDto,
    userId: number,
  ): Promise<JobResponseDto> {
    const existingJob = await this.prisma.congViec.findUnique({
      where: { id },
      select: { nguoi_tao: true },
    });

    if (!existingJob) {
      throw new NotFoundException(`Công việc với ID ${id} không tồn tại`);
    }

    if (existingJob.nguoi_tao !== userId) {
      throw new ForbiddenException('Bạn không có quyền cập nhật công việc này');
    }

    const job = await this.prisma.congViec.update({
      where: { id },
      data: updateJobDto,
      include: {
        chiTietLoaiCongViec: {
          include: {
            loaiCongViec: true,
          },
        },
        nguoiTao: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return job;
  }

  async remove(id: number, userId: number): Promise<void> {
    const existingJob = await this.prisma.congViec.findUnique({
      where: { id },
      select: { nguoi_tao: true },
    });

    if (!existingJob) {
      throw new NotFoundException(`Công việc với ID ${id} không tồn tại`);
    }

    if (existingJob.nguoi_tao !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa công việc này');
    }

    await this.prisma.congViec.delete({
      where: { id },
    });
  }

  async getJobCategories() {
    return this.prisma.chiTietLoaiCongViec.findMany({
      include: {
        loaiCongViec: true,
      },
    });
  }

  async searchJobs(
    searchDto: JobSearchDto,
    page: number = 1,
    size: number = 10,
  ) {
    const skip = (page - 1) * size;

    const where: any = {};

    if (searchDto.search) {
      where.ten_cong_viec = {
        contains: searchDto.search,
        mode: 'insensitive',
      };
    }

    if (searchDto.category) {
      where.ma_chi_tiet_loai = searchDto.category;
    }

    if (searchDto.minPrice !== undefined || searchDto.maxPrice !== undefined) {
      where.gia_tien = {};
      if (searchDto.minPrice !== undefined) {
        where.gia_tien.gte = searchDto.minPrice;
      }
      if (searchDto.maxPrice !== undefined) {
        where.gia_tien.lte = searchDto.maxPrice;
      }
    }

    if (searchDto.minRating !== undefined) {
      where.sao_cong_viec = {
        gte: searchDto.minRating,
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
              loaiCongViec: true,
            },
          },
          nguoiTao: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.congViec.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: jobs,
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
}
