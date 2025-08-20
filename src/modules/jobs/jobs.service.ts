import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobResponseDto } from './dto/jobs.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
    categoryId?: number,
  ): Promise<{ data: JobResponseDto[]; pagination: any }> {
    const skip = (page - 1) * size;
    const where: any = {};

    if (search) {
      where.ten_cong_viec = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (categoryId) {
      where.ma_chi_tiet_loai = categoryId;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where,
        skip,
        take: size,
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

  async findByUserId(
    userId: number,
    page: number = 1,
    size: number = 10,
  ): Promise<{ data: JobResponseDto[]; pagination: any }> {
    const skip = (page - 1) * size;

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where: { nguoi_tao: userId },
        skip,
        take: size,
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
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.congViec.count({
        where: { nguoi_tao: userId },
      }),
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

  async findByCategory(
    categoryId: number,
    page: number = 1,
    size: number = 10,
  ): Promise<{ data: JobResponseDto[]; pagination: any }> {
    const skip = (page - 1) * size;

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where: { ma_chi_tiet_loai: categoryId },
        skip,
        take: size,
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
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.congViec.count({
        where: { ma_chi_tiet_loai: categoryId },
      }),
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
