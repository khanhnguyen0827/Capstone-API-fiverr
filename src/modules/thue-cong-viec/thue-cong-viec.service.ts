import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThueCongViecDto } from './dto/create-thue-cong-viec.dto';
import { UpdateThueCongViecDto } from './dto/update-thue-cong-viec.dto';

@Injectable()
export class ThueCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createThueCongViecDto: CreateThueCongViecDto) {
    const thueCongViec = await this.prisma.thueCongViec.create({
      data: createThueCongViecDto,
      include: {
        CongViec: {
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

    return thueCongViec;
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

    // Lấy danh sách thuê công việc
    const thueCongViecs = await this.prisma.thueCongViec.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        ngay_thue: 'desc',
      },
      where: where,
      include: {
        CongViec: {
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

    // Đếm tổng số thuê công việc
    const totalItem = await this.prisma.thueCongViec.count({
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
    const thueCongViec = await this.prisma.thueCongViec.findUnique({
      where: { id },
      include: {
        CongViec: {
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

    if (!thueCongViec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID: ${id}`);
    }

    return thueCongViec;
  }

  async update(id: number, updateThueCongViecDto: UpdateThueCongViecDto) {
    // Kiểm tra thuê công việc có tồn tại
    const existingThueCongViec = await this.prisma.thueCongViec.findUnique({
      where: { id },
    });

    if (!existingThueCongViec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID: ${id}`);
    }

    const updatedThueCongViec = await this.prisma.thueCongViec.update({
      where: { id },
      data: updateThueCongViecDto,
      include: {
        CongViec: {
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

    return updatedThueCongViec;
  }

  async remove(id: number) {
    // Kiểm tra thuê công việc có tồn tại
    const existingThueCongViec = await this.prisma.thueCongViec.findUnique({
      where: { id },
    });

    if (!existingThueCongViec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID: ${id}`);
    }

    await this.prisma.thueCongViec.delete({
      where: { id },
    });

    return { message: 'Xóa thuê công việc thành công' };
  }

  async findByCongViec(maCongViec: number) {
    return await this.prisma.thueCongViec.findMany({
      where: { ma_cong_viec: maCongViec },
      include: {
        CongViec: {
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
        ngay_thue: 'desc',
      },
    });
  }

  async findByUser(maNguoiThue: number) {
    return await this.prisma.thueCongViec.findMany({
      where: { ma_nguoi_thue: maNguoiThue },
      include: {
        CongViec: {
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
        ngay_thue: 'desc',
      },
    });
  }

  async completeJob(id: number) {
    // Kiểm tra thuê công việc có tồn tại
    const existingThueCongViec = await this.prisma.thueCongViec.findUnique({
      where: { id },
    });

    if (!existingThueCongViec) {
      throw new NotFoundException(`Không tìm thấy thuê công việc với ID: ${id}`);
    }

    const updatedThueCongViec = await this.prisma.thueCongViec.update({
      where: { id },
      data: { hoan_thanh: true },
      include: {
        CongViec: {
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

    return updatedThueCongViec;
  }
}
