import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCongViecDto } from './dto/create-cong-viec.dto';
import { UpdateCongViecDto } from './dto/update-cong-viec.dto';

@Injectable()
export class CongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCongViecDto: CreateCongViecDto) {
    // Kiểm tra xem người tạo có tồn tại không
    const nguoiTao = await this.prisma.users.findUnique({
      where: { id: createCongViecDto.nguoi_tao },
    });

    if (!nguoiTao) {
      throw new NotFoundException('Người tạo không tồn tại');
    }

    // Tạo công việc mới
    const cong_viec = await this.prisma.cong_viec.create({
      data: createCongViecDto,
      include: {
        ChiTietLoaiCongViec: true,
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
    });

    return cong_viec;
  }

  async findAll(query: any = {}) {
    const { page = 1, pageSize = 10, filters = '{}', search = '' } = query;
    
    // Xử lý pagination
    const currentPage = +page > 0 ? +page : 1;
    const currentPageSize = +pageSize > 0 ? +pageSize : 10;
    
    // Xử lý filters
    let parsedFilters = {};
    try {
      parsedFilters = JSON.parse(filters);
    } catch (error) {
      parsedFilters = {};
    }

    // Xử lý và validate filters
    const where: any = {
      is_deleted: false,
    };
    
    Object.entries(parsedFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== null && value !== undefined) {
        if (typeof value === 'string') {
          where[key] = { contains: value };
        } else {
          where[key] = value;
        }
      }
    });

    // Xử lý search
    if (search) {
      where.OR = [
        { ten_cong_viec: { contains: search } },
        { mo_ta: { contains: search } },
        { mo_ta_ngan: { contains: search } },
      ];
    }

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách công việc
    const congViecs = await this.prisma.cong_viec.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        created_at: 'desc',
      },
      where: where,
      include: {
        ChiTietLoaiCongViec: {
          include: {
            LoaiCongViec: true,
          },
        },
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        BinhLuan: {
          where: { is_deleted: false },
          include: {
            Users: {
              select: {
                id: true,
                ho_ten: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Đếm tổng số công việc
    const totalItem = await this.prisma.cong_viec.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / currentPageSize);

    return {
      page: currentPage,
      pageSize: currentPageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: congViecs,
    };
  }

  async findOne(id: number) {
    const cong_viec = await this.prisma.cong_viec.findUnique({
      where: { id },
      include: {
        ChiTietLoaiCongViec: {
          include: {
            LoaiCongViec: true,
          },
        },
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        BinhLuan: {
          where: { is_deleted: false },
          include: {
            Users: {
              select: {
                id: true,
                ho_ten: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!cong_viec) {
      throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
    }

    return cong_viec;
  }

  async update(id: number, updateCongViecDto: UpdateCongViecDto) {
    // Kiểm tra xem công việc có tồn tại không
    const existingCongViec = await this.prisma.cong_viec.findUnique({
      where: { id },
    });

    if (!existingCongViec) {
      throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
    }

    // Cập nhật công việc
    const updatedCongViec = await this.prisma.cong_viec.update({
      where: { id },
      data: updateCongViecDto,
      include: {
        ChiTietLoaiCongViec: {
          include: {
            LoaiCongViec: true,
          },
        },
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
    });

    return updatedCongViec;
  }

  async remove(id: number) {
    // Kiểm tra xem công việc có tồn tại không
    const existingCongViec = await this.prisma.cong_viec.findUnique({
      where: { id },
    });

    if (!existingCongViec) {
      throw new NotFoundException(`Không tìm thấy công việc với ID ${id}`);
    }

    // Xóa công việc (soft delete)
    await this.prisma.cong_viec.update({
      where: { id },
      data: { is_deleted: true },
    });

    return { message: `Đã xóa công việc với ID ${id}` };
  }

  async findByCategory(categoryId: number) {
    const congViecs = await this.prisma.cong_viec.findMany({
      where: {
        ma_chi_tiet_loai: categoryId,
        is_deleted: false,
      },
      include: {
        ChiTietLoaiCongViec: {
          include: {
            LoaiCongViec: true,
          },
        },
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return congViecs;
  }

  async findByUser(userId: number) {
    // Kiểm tra xem user có tồn tại không
    const nguoiTaoUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!nguoiTaoUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const congViecs = await this.prisma.cong_viec.findMany({
      where: {
        nguoi_tao: userId,
        is_deleted: false,
      },
      include: {
        ChiTietLoaiCongViec: {
          include: {
            LoaiCongViec: true,
          },
        },
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return congViecs;
  }

  async searchJobs(searchTerm: string) {
    const congViecs = await this.prisma.cong_viec.findMany({
      where: {
        OR: [
          { ten_cong_viec: { contains: searchTerm } },
          { mo_ta: { contains: searchTerm } },
          { mo_ta_ngan: { contains: searchTerm } },
        ],
        is_deleted: false,
      },
      include: {
        ChiTietLoaiCongViec: {
          include: {
            LoaiCongViec: true,
          },
        },
        Users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return congViecs;
  }
}
