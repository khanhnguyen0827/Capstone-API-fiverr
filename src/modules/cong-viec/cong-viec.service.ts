import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCongViecDto } from './dto/create-cong-viec.dto';
import { UpdateCongViecDto } from './dto/update-cong-viec.dto';

@Injectable()
export class CongViecService {
  private readonly logger = new Logger(CongViecService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCongViecDto: CreateCongViecDto) {
    try {
      // Validate required fields
      if (!createCongViecDto.ten_cong_viec || createCongViecDto.ten_cong_viec.trim().length < 3) {
        throw new BadRequestException('Tên công việc phải có ít nhất 3 ký tự');
      }

      if (createCongViecDto.gia_tien && createCongViecDto.gia_tien < 0) {
        throw new BadRequestException('Giá tiền không được âm');
      }

      // Validate chi tiết loại công việc exists
      if (createCongViecDto.ma_chi_tiet_loai) {
        const chiTietLoai = await this.prisma.chiTietLoaiCongViec.findUnique({
          where: { id: createCongViecDto.ma_chi_tiet_loai },
        });
        if (!chiTietLoai) {
          throw new BadRequestException('Chi tiết loại công việc không tồn tại');
        }
      }

      // Validate người tạo exists
      if (createCongViecDto.nguoi_tao) {
        const nguoiTao = await this.prisma.nguoiDung.findUnique({
          where: { id: createCongViecDto.nguoi_tao },
        });
        if (!nguoiTao) {
          throw new BadRequestException('Người tạo không tồn tại');
        }
      }

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

      this.logger.log(`Job created successfully: ${congViec.ten_cong_viec}`);
      return congViec;
    } catch (error) {
      this.logger.error(`Job creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(query: any = {}) {
    try {
      const { page = 1, pageSize = 10, filters = '{}', search = '', sortBy = 'id', sortOrder = 'desc' } = query;
      
      // Xử lý pagination
      const currentPage = +page > 0 ? +page : 1;
      const currentPageSize = +pageSize > 0 && +pageSize <= 100 ? +pageSize : 10;
      
      // Xử lý filters
      let parsedFilters = {};
      try {
        parsedFilters = JSON.parse(filters);
      } catch (error) {
        this.logger.warn(`Invalid filters format: ${filters}`);
        parsedFilters = {};
      }

      // Xử lý và validate filters
      const where: any = {};
      Object.entries(parsedFilters).forEach(([key, value]) => {
        if (value && value !== '' && value !== null && value !== undefined) {
          if (typeof value === 'string') {
            where[key] = { contains: value, mode: 'insensitive' };
          } else {
            where[key] = value;
          }
        }
      });

      // Xử lý search
      if (search && search.trim()) {
        where.OR = [
          { ten_cong_viec: { contains: search.trim(), mode: 'insensitive' } },
          { mo_ta: { contains: search.trim(), mode: 'insensitive' } },
          { cong_ty: { contains: search.trim(), mode: 'insensitive' } },
        ];
      }

      // Validate sortBy field
      const allowedSortFields = ['id', 'ten_cong_viec', 'gia_tien'];
      const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'id';
      const validSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

      // Tính toán skip cho pagination
      const skip = (currentPage - 1) * currentPageSize;

      // Lấy danh sách công việc
      const congViecs = await this.prisma.congViec.findMany({
        take: currentPageSize,
        skip: skip,
        orderBy: {
          [validSortBy]: validSortOrder,
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
        sortBy: validSortBy,
        sortOrder: validSortOrder,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch jobs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID không hợp lệ');
      }

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
            orderBy: {
              ngay_binh_luan: 'desc',
            },
          },
        },
      });

      if (!congViec) {
        throw new NotFoundException(`Không tìm thấy công việc với ID: ${id}`);
      }

      return congViec;
    } catch (error) {
      this.logger.error(`Failed to fetch job ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateCongViecDto: UpdateCongViecDto) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID không hợp lệ');
      }

      // Validate required fields
      if (updateCongViecDto.ten_cong_viec && updateCongViecDto.ten_cong_viec.trim().length < 3) {
        throw new BadRequestException('Tên công việc phải có ít nhất 3 ký tự');
      }

      if (updateCongViecDto.gia_tien && updateCongViecDto.gia_tien < 0) {
        throw new BadRequestException('Giá tiền không được âm');
      }

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

      this.logger.log(`Job updated successfully: ${updatedCongViec.ten_cong_viec}`);
      return updatedCongViec;
    } catch (error) {
      this.logger.error(`Failed to update job ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID không hợp lệ');
      }

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

      this.logger.log(`Job deleted successfully: ${existingCongViec.ten_cong_viec}`);
      return { message: 'Xóa công việc thành công' };
    } catch (error) {
      this.logger.error(`Failed to delete job ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByCategory(maChiTietLoai: number) {
    try {
      if (!maChiTietLoai || maChiTietLoai <= 0) {
        throw new BadRequestException('ID chi tiết loại công việc không hợp lệ');
      }

      // Validate chi tiết loại công việc exists
      const chiTietLoai = await this.prisma.chiTietLoaiCongViec.findUnique({
        where: { id: maChiTietLoai },
      });
      if (!chiTietLoai) {
        throw new NotFoundException('Chi tiết loại công việc không tồn tại');
      }

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
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch jobs by category ${maChiTietLoai}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUser(nguoiTao: number) {
    try {
      if (!nguoiTao || nguoiTao <= 0) {
        throw new BadRequestException('ID người tạo không hợp lệ');
      }

      // Validate người tạo exists
      const nguoiTaoUser = await this.prisma.nguoiDung.findUnique({
        where: { id: nguoiTao },
      });
      if (!nguoiTaoUser) {
        throw new NotFoundException('Người tạo không tồn tại');
      }

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
        orderBy: {
          id: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Failed to fetch jobs by user ${nguoiTao}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
