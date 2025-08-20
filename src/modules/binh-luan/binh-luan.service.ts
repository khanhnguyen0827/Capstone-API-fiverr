import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBinhLuanDto } from './dto/create-binh-luan.dto';
import { UpdateBinhLuanDto } from './dto/update-binh-luan.dto';

@Injectable()
export class BinhLuanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBinhLuanDto: CreateBinhLuanDto) {
    // Kiểm tra xem người bình luận có tồn tại không
    const nguoiBinhLuan = await this.prisma.users.findUnique({
      where: { id: createBinhLuanDto.ma_nguoi_binh_luan },
    });

    if (!nguoiBinhLuan) {
      throw new NotFoundException('Người bình luận không tồn tại');
    }

    // Kiểm tra xem công việc có tồn tại không
    const congViec = await this.prisma.cong_viec.findUnique({
      where: { id: createBinhLuanDto.ma_cong_viec },
    });

    if (!congViec) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    // Tạo bình luận mới
    const binh_luan = await this.prisma.binh_luan.create({
      data: createBinhLuanDto,
      include: {
        users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
          },
        },
      },
    });

    return binh_luan;
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
        { noi_dung: { contains: search } },
      ];
    }

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách bình luận
    const binhLuans = await this.prisma.binh_luan.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        ngay_binh_luan: 'desc',
      },
      where: where,
      include: {
        users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
          },
        },
      },
    });

    // Đếm tổng số bình luận
    const totalItem = await this.prisma.binh_luan.count({
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
    const binh_luan = await this.prisma.binh_luan.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
          },
        },
      },
    });

    if (!binh_luan) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID ${id}`);
    }

    return binh_luan;
  }

  async update(id: number, updateBinhLuanDto: UpdateBinhLuanDto) {
    // Kiểm tra xem bình luận có tồn tại không
    const existingBinhLuan = await this.prisma.binh_luan.findUnique({
      where: { id },
    });

    if (!existingBinhLuan) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID ${id}`);
    }

    // Cập nhật bình luận
    const updatedBinhLuan = await this.prisma.binh_luan.update({
      where: { id },
      data: updateBinhLuanDto,
      include: {
        users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
          },
        },
      },
    });

    return updatedBinhLuan;
  }

  async remove(id: number) {
    // Kiểm tra xem bình luận có tồn tại không
    const existingBinhLuan = await this.prisma.binh_luan.findUnique({
      where: { id },
    });

    if (!existingBinhLuan) {
      throw new NotFoundException(`Không tìm thấy bình luận với ID ${id}`);
    }

    // Xóa bình luận (soft delete)
    await this.prisma.binh_luan.update({
      where: { id },
      data: { is_deleted: true },
    });

    return { message: `Đã xóa bình luận với ID ${id}` };
  }

  async findByUser(userId: number) {
    // Kiểm tra xem user có tồn tại không
    const nguoiBinhLuan = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!nguoiBinhLuan) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const binhLuans = await this.prisma.binh_luan.findMany({
      where: {
        ma_nguoi_binh_luan: userId,
        is_deleted: false,
      },
      include: {
        users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
          },
        },
      },
      orderBy: {
        ngay_binh_luan: 'desc',
      },
    });

    return binhLuans;
  }

  async findByCongViec(congViecId: number) {
    // Kiểm tra xem công việc có tồn tại không
    const congViec = await this.prisma.cong_viec.findUnique({
      where: { id: congViecId },
    });

    if (!congViec) {
      throw new NotFoundException('Công việc không tồn tại');
    }

    const binhLuans = await this.prisma.binh_luan.findMany({
      where: {
        ma_cong_viec: congViecId,
        is_deleted: false,
      },
      include: {
        users: {
          select: {
            id: true,
            ho_ten: true,
            email: true,
          },
        },
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
          },
        },
      },
      orderBy: {
        ngay_binh_luan: 'desc',
      },
    });

    return binhLuans;
  }
}
