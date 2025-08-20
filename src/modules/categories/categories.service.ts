import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMainCategories() {
    const categories = await this.prisma.loaiCongViec.findMany({
      select: {
        id: true,
        ten_loai_cong_viec: true,
      },
    });

    return {
      statusCode: 200,
      message: 'Lấy danh mục thành công',
      data: categories,
    };
  }

  async getSubCategories() {
    const subCategories = await this.prisma.chiTietLoaiCongViec.findMany({
      include: {
        LoaiCongViec: {
          select: {
            id: true,
            ten_loai_cong_viec: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Lấy danh mục con thành công',
      data: subCategories,
    };
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.loaiCongViec.findUnique({
      where: { id },
      select: {
        id: true,
        ten_loai_cong_viec: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }

    return {
      statusCode: 200,
      message: 'Lấy thông tin danh mục thành công',
      data: category,
    };
  }

  async createMainCategory(ten_loai_cong_viec: string) {
    const category = await this.prisma.loaiCongViec.create({
      data: { ten_loai_cong_viec },
      select: {
        id: true,
        ten_loai_cong_viec: true,
      },
    });

    return {
      statusCode: 201,
      message: 'Tạo danh mục thành công',
      data: category,
    };
  }

  async createSubCategory(data: {
    ten_chi_tiet: string;
    hinh_anh?: string;
    ma_loai_cong_viec: number;
  }) {
    const subCategory = await this.prisma.chiTietLoaiCongViec.create({
      data,
      include: {
        LoaiCongViec: {
          select: {
            id: true,
            ten_loai_cong_viec: true,
          },
        },
      },
    });

    return {
      statusCode: 201,
      message: 'Tạo danh mục con thành công',
      data: subCategory,
    };
  }

  async updateMainCategory(id: number, ten_loai_cong_viec: string) {
    const category = await this.prisma.loaiCongViec.update({
      where: { id },
      data: { ten_loai_cong_viec },
      select: {
        id: true,
        ten_loai_cong_viec: true,
      },
    });

    return {
      statusCode: 200,
      message: 'Cập nhật danh mục thành công',
      data: category,
    };
  }

  async updateSubCategory(
    id: number,
    data: {
      ten_chi_tiet?: string;
      hinh_anh?: string;
      ma_loai_cong_viec?: number;
    },
  ) {
    const subCategory = await this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data,
      include: {
        LoaiCongViec: {
          select: {
            id: true,
            ten_loai_cong_viec: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      message: 'Cập nhật danh mục con thành công',
      data: subCategory,
    };
  }

  async deleteMainCategory(id: number) {
    await this.prisma.loaiCongViec.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: 'Xóa danh mục thành công',
      data: { id },
    };
  }

  async deleteSubCategory(id: number) {
    await this.prisma.chiTietLoaiCongViec.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: 'Xóa danh mục con thành công',
      data: { id },
    };
  }
}
