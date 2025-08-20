import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoaiCongViecDto } from './dto/create-loai-cong-viec.dto';
import { UpdateLoaiCongViecDto } from './dto/update-loai-cong-viec.dto';

@Injectable()
export class LoaiCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoaiCongViecDto: CreateLoaiCongViecDto) {
    // Tạo loại công việc mới
    const loai_cong_viec = await this.prisma.loai_cong_viec.create({
      data: createLoaiCongViecDto,
    });

    return loai_cong_viec;
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
        { ten_loai_cong_viec: { contains: search } },
        { mo_ta: { contains: search } },
      ];
    }

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách loại công việc
    const loaiCongViecs = await this.prisma.loai_cong_viec.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        thu_tu: 'asc',
      },
      where: where,
      include: {
        ChiTietLoaiCongViec: {
          where: { is_deleted: false },
          orderBy: { thu_tu: 'asc' },
        },
      },
    });

    // Đếm tổng số loại công việc
    const totalItem = await this.prisma.loai_cong_viec.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / currentPageSize);

    return {
      page: currentPage,
      pageSize: currentPageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: loaiCongViecs,
    };
  }

  async findOne(id: number) {
    const loai_cong_viec = await this.prisma.loai_cong_viec.findUnique({
      where: { id },
      include: {
        ChiTietLoaiCongViec: {
          where: { is_deleted: false },
          orderBy: { thu_tu: 'asc' },
        },
      },
    });

    if (!loai_cong_viec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID ${id}`);
    }

    return loai_cong_viec;
  }

  async update(id: number, updateLoaiCongViecDto: UpdateLoaiCongViecDto) {
    // Kiểm tra xem loại công việc có tồn tại không
    const existingLoaiCongViec = await this.prisma.loai_cong_viec.findUnique({
      where: { id },
    });

    if (!existingLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID ${id}`);
    }

    // Cập nhật loại công việc
    const updatedLoaiCongViec = await this.prisma.loai_cong_viec.update({
      where: { id },
      data: updateLoaiCongViecDto,
      include: {
        ChiTietLoaiCongViec: {
          where: { is_deleted: false },
          orderBy: { thu_tu: 'asc' },
        },
      },
    });

    return updatedLoaiCongViec;
  }

  async remove(id: number) {
    // Kiểm tra xem loại công việc có tồn tại không
    const existingLoaiCongViec = await this.prisma.loai_cong_viec.findUnique({
      where: { id },
    });

    if (!existingLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID ${id}`);
    }

    // Xóa loại công việc (soft delete)
    await this.prisma.loai_cong_viec.update({
      where: { id },
      data: { is_deleted: true },
    });

    return { message: `Đã xóa loại công việc với ID ${id}` };
  }

  async updateOrder(id: number, newOrder: number) {
    // Kiểm tra xem loại công việc có tồn tại không
    const existingLoaiCongViec = await this.prisma.loai_cong_viec.findUnique({
      where: { id },
    });

    if (!existingLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID ${id}`);
    }

    // Cập nhật thứ tự
    const updatedLoaiCongViec = await this.prisma.loai_cong_viec.update({
      where: { id },
      data: { thu_tu: newOrder },
    });

    return updatedLoaiCongViec;
  }

  async getWithChiTiet() {
    const loaiCongViecs = await this.prisma.loai_cong_viec.findMany({
      where: { is_deleted: false },
      include: {
        ChiTietLoaiCongViec: {
          where: { is_deleted: false },
          orderBy: { thu_tu: 'asc' },
        },
      },
      orderBy: { thu_tu: 'asc' },
    });

    return loaiCongViecs;
  }
}
