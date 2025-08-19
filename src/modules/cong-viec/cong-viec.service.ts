import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCongViecDto } from './dto/create-cong-viec.dto';
import { UpdateCongViecDto } from './dto/update-cong-viec.dto';

@Injectable()
export class CongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCongViecDto: CreateCongViecDto) {
    const congViec = await this.prisma.congViec.create({
      data: createCongViecDto,
      include: {
        ChiTietLoaiCongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return congViec;
  }

  async findAll(query: any = {}) {
    const { page = 1, pageSize = 10, filters = '{}' } = query;
    
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
    const where: any = {};
    Object.entries(parsedFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== null && value !== undefined) {
        if (typeof value === 'string') {
          where[key] = { contains: value };
        } else {
          where[key] = value;
        }
      }
    });

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách công việc
    const congViecs = await this.prisma.congViec.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        id: 'desc',
      },
      where: where,
      include: {
        ChiTietLoaiCongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Đếm tổng số công việc
    const totalItem = await this.prisma.congViec.count({
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
    const congViec = await this.prisma.congViec.findUnique({
      where: { id },
      include: {
        ChiTietLoaiCongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        BinhLuan: {
          include: {
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
    });

    if (!congViec) {
      throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
    }

    return congViec;
  }

  async update(id: number, updateCongViecDto: UpdateCongViecDto) {
    // Kiểm tra công việc có tồn tại
    const existingCongViec = await this.prisma.congViec.findUnique({
      where: { id },
    });

    if (!existingCongViec) {
      throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
    }

    const updatedCongViec = await this.prisma.congViec.update({
      where: { id },
      data: updateCongViecDto,
      include: {
        ChiTietLoaiCongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedCongViec;
  }

  async remove(id: number) {
    // Kiểm tra công việc có tồn tại
    const existingCongViec = await this.prisma.congViec.findUnique({
      where: { id },
    });

    if (!existingCongViec) {
      throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
    }

    await this.prisma.congViec.delete({
      where: { id },
    });

    return { message: 'Xóa công việc thành công' };
  }

  async findByCategory(maChiTietLoai: number) {
    return await this.prisma.congViec.findMany({
      where: { ma_chi_tiet_loai: maChiTietLoai },
      include: {
        ChiTietLoaiCongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUser(nguoiTao: number) {
    return await this.prisma.congViec.findMany({
      where: { nguoi_tao: nguoiTao },
      include: {
        ChiTietLoaiCongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
