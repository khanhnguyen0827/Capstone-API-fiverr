import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThueCongViecDto } from './dto/create-thue-cong-viec.dto';
import { UpdateThueCongViecDto } from './dto/update-thue-cong-viec.dto';

@Injectable()
export class ThueCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createThueCongViecDto: CreateThueCongViecDto) {
    const thue_cong_viec = await this.prisma.thue_cong_viec.create({
      data: createThueCongViecDto,
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
    });

    return thue_cong_viec;
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
        { ghi_chu: { contains: search } },
        { noi_dung_danh_gia: { contains: search } },
      ];
    }

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách thuê công việc
    const thueCongViecs = await this.prisma.thue_cong_viec.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        ngay_thue: 'desc',
      },
      where: where,
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
    });

    // Đếm tổng số thuê công việc
    const totalItem = await this.prisma.thue_cong_viec.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / currentPageSize);

    return {
      page: currentPage,
      pageSize: currentPageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: thueCongViecs,
    };
  }

  async findOne(id: number) {
    const thue_cong_viec = await this.prisma.thue_cong_viec.findUnique({
      where: { id },
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
            mo_ta: true,
          },
        },
      },
    });

    if (!thue_cong_viec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID ${id}`);
    }

    return thue_cong_viec;
  }

  async update(id: number, updateThueCongViecDto: UpdateThueCongViecDto) {
    // Kiểm tra xem thuê công việc có tồn tại không
    const existingThueCongViec = await this.prisma.thue_cong_viec.findUnique({
      where: { id },
    });

    if (!existingThueCongViec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID ${id}`);
    }

    // Cập nhật thuê công việc
    const updatedThueCongViec = await this.prisma.thue_cong_viec.update({
      where: { id },
      data: updateThueCongViecDto,
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
    });

    return updatedThueCongViec;
  }

  async remove(id: number) {
    // Kiểm tra xem thuê công việc có tồn tại không
    const existingThueCongViec = await this.prisma.thue_cong_viec.findUnique({
      where: { id },
    });

    if (!existingThueCongViec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID ${id}`);
    }

    // Xóa thuê công việc (soft delete)
    await this.prisma.thue_cong_viec.update({
      where: { id },
      data: { is_deleted: true },
    });

    return { message: `Đã xóa thuê công việc với ID ${id}` };
  }

  async findByUser(userId: number) {
    const thueCongViecs = await this.prisma.thue_cong_viec.findMany({
      where: {
        ma_nguoi_thue: userId,
        is_deleted: false,
      },
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        ngay_thue: 'desc',
      },
    });

    return thueCongViecs;
  }

  async findByWorker(userId: number) {
    const thueCongViecs = await this.prisma.thue_cong_viec.findMany({
      where: {
        ma_nguoi_lam: userId,
        is_deleted: false,
      },
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        ngay_thue: 'desc',
      },
    });

    return thueCongViecs;
  }

  async findByStatus(status: string) {
    const thueCongViecs = await this.prisma.thue_cong_viec.findMany({
      where: {
        trang_thai: status,
        is_deleted: false,
      },
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        ngay_thue: 'desc',
      },
    });

    return thueCongViecs;
  }

  async findByJob(jobId: number) {
    const thueCongViecs = await this.prisma.thue_cong_viec.findMany({
      where: {
        ma_cong_viec: jobId,
        is_deleted: false,
      },
      include: {
        cong_viec: {
          select: {
            id: true,
            ten_cong_viec: true,
            gia_tien: true,
            hinh_anh: true,
          },
        },
      },
      orderBy: {
        ngay_thue: 'desc',
      },
    });

    return thueCongViecs;
  }
}
