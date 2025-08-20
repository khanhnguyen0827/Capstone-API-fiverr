import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChiTietLoaiCongViecDto } from './dto/create-chi-tiet-loai-cong-viec.dto';
import { UpdateChiTietLoaiCongViecDto } from './dto/update-chi-tiet-loai-cong-viec.dto';

@Injectable()
export class ChiTietLoaiCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChiTietLoaiCongViecDto: CreateChiTietLoaiCongViecDto) {
    // Kiểm tra xem loại công việc có tồn tại không
    const loai_cong_viec = await this.prisma.loai_cong_viec.findUnique({
      where: { id: createChiTietLoaiCongViecDto.ma_loai_cong_viec },
    });

    if (!loai_cong_viec) {
      throw new NotFoundException('Loại công việc không tồn tại');
    }

    // Tạo chi tiết loại công việc mới
    const chi_tiet_loai_cong_viec = await this.prisma.chi_tiet_loai_cong_viec.create({
      data: createChiTietLoaiCongViecDto,
      include: {
        LoaiCongViec: true,
      },
    });

    return chi_tiet_loai_cong_viec;
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
        { ten_chi_tiet: { contains: search } },
        { mo_ta: { contains: search } },
      ];
    }

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách chi tiết loại công việc
    const chiTietLoaiCongViecs = await this.prisma.chi_tiet_loai_cong_viec.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        thu_tu: 'asc',
      },
      where: where,
      include: {
        LoaiCongViec: true,
      },
    });

    // Đếm tổng số chi tiết loại công việc
    const totalItem = await this.prisma.chi_tiet_loai_cong_viec.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / currentPageSize);

    return {
      page: currentPage,
      pageSize: currentPageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: chiTietLoaiCongViecs,
    };
  }

  async findOne(id: number) {
    const chi_tiet_loai_cong_viec = await this.prisma.chi_tiet_loai_cong_viec.findUnique({
      where: { id },
      include: {
        LoaiCongViec: true,
      },
    });

    if (!chi_tiet_loai_cong_viec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID ${id}`);
    }

    return chi_tiet_loai_cong_viec;
  }

  async update(id: number, updateChiTietLoaiCongViecDto: UpdateChiTietLoaiCongViecDto) {
    // Kiểm tra xem chi tiết loại công việc có tồn tại không
    const existingChiTietLoaiCongViec = await this.prisma.chi_tiet_loai_cong_viec.findUnique({
      where: { id },
    });

    if (!existingChiTietLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID ${id}`);
    }

    // Cập nhật chi tiết loại công việc
    const updatedChiTietLoaiCongViec = await this.prisma.chi_tiet_loai_cong_viec.update({
      where: { id },
      data: updateChiTietLoaiCongViecDto,
      include: {
        LoaiCongViec: true,
      },
    });

    return updatedChiTietLoaiCongViec;
  }

  async remove(id: number) {
    // Kiểm tra xem chi tiết loại công việc có tồn tại không
    const existingChiTietLoaiCongViec = await this.prisma.chi_tiet_loai_cong_viec.findUnique({
      where: { id },
    });

    if (!existingChiTietLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID ${id}`);
    }

    // Xóa chi tiết loại công việc (soft delete)
    await this.prisma.chi_tiet_loai_cong_viec.update({
      where: { id },
      data: { is_deleted: true },
    });

    return { message: `Đã xóa chi tiết loại công việc với ID ${id}` };
  }

  async findByLoaiCongViec(loaiCongViecId: number) {
    // Kiểm tra xem loại công việc có tồn tại không
    const loai_cong_viec = await this.prisma.loai_cong_viec.findUnique({
      where: { id: loaiCongViecId },
    });

    if (!loai_cong_viec) {
      throw new NotFoundException('Loại công việc không tồn tại');
    }

    const chiTietLoaiCongViecs = await this.prisma.chi_tiet_loai_cong_viec.findMany({
      where: {
        ma_loai_cong_viec: loaiCongViecId,
        is_deleted: false,
      },
      include: {
        LoaiCongViec: true,
      },
      orderBy: {
        thu_tu: 'asc',
      },
    });

    return chiTietLoaiCongViecs;
  }

  async updateOrder(id: number, newOrder: number) {
    // Kiểm tra xem chi tiết loại công việc có tồn tại không
    const existingChiTietLoaiCongViec = await this.prisma.chi_tiet_loai_cong_viec.findUnique({
      where: { id },
    });

    if (!existingChiTietLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID ${id}`);
    }

    // Cập nhật thứ tự
    const updatedChiTietLoaiCongViec = await this.prisma.chi_tiet_loai_cong_viec.update({
      where: { id },
      data: { thu_tu: newOrder },
      include: {
        LoaiCongViec: true,
      },
    });

    return updatedChiTietLoaiCongViec;
  }
}
