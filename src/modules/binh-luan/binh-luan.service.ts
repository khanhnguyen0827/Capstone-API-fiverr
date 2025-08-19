import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';

@Injectable()
export class BinhLuanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBinhLuanDto: CreateBinhLuanDto) {
    const binhLuan = await this.prisma.binhLuan.create({
      data: createBinhLuanDto,
      include: {
        CongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return binhLuan;
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

    // Lấy danh sách bình luận
    const binhLuans = await this.prisma.binhLuan.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        ngay_binh_luan: 'desc',
      },
      where: where,
      include: {
        CongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Đếm tổng số bình luận
    const totalItem = await this.prisma.binhLuan.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / currentPageSize);

    return {
      page: currentPage,
      pageSize: currentPageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: binhLuans,
    };
  }

  async findOne(id: number) {
    const binhLuan = await this.prisma.binhLuan.findUnique({
      where: { id },
      include: {
        CongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!binhLuan) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID: ${id}`);
    }

    return binhLuan;
  }

  async update(id: number, updateBinhLuanDto: UpdateBinhLuanDto) {
    // Kiểm tra bình luận có tồn tại
    const existingBinhLuan = await this.prisma.binhLuan.findUnique({
      where: { id },
    });

    if (!existingBinhLuan) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID: ${id}`);
    }

    const updatedBinhLuan = await this.prisma.binhLuan.update({
      where: { id },
      data: updateBinhLuanDto,
      include: {
        CongViec: true,
        NguoiDung: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return updatedBinhLuan;
  }

  async remove(id: number) {
    // Kiểm tra bình luận có tồn tại
    const existingBinhLuan = await this.prisma.binhLuan.findUnique({
      where: { id },
    });

    if (!existingBinhLuan) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID: ${id}`);
    }

    await this.prisma.binhLuan.delete({
      where: { id },
    });

    return { message: 'Xóa bình luận thành công' };
  }

  async findByCongViec(maCongViec: number) {
    return await this.prisma.binhLuan.findMany({
      where: { ma_cong_viec: maCongViec },
      include: {
        CongViec: true,
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
    });
  }

  async findByUser(maNguoiBinhLuan: number) {
    return await this.prisma.binhLuan.findMany({
      where: { ma_nguoi_binh_luan: maNguoiBinhLuan },
      include: {
        CongViec: true,
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
    });
  }
}
