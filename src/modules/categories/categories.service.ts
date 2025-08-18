import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    return await this.prisma.loaiCongViec.findMany({
      include: {
        chiTietLoaiCongViec: {
          select: {
            id: true,
            ten_chi_tiet: true,
            hinh_anh: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  async getMainCategories() {
    return await this.prisma.loaiCongViec.findMany({
      select: {
        id: true,
        ten_loai_cong_viec: true
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  async getMainCategoryById(id: number) {
    const category = await this.prisma.loaiCongViec.findUnique({
      where: { id },
      include: {
        chiTietLoaiCongViec: {
          select: {
            id: true,
            ten_chi_tiet: true,
            hinh_anh: true
          },
          orderBy: {
            id: 'asc'
          }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    return category;
  }

  async createMainCategory(createCategoryDto: any) {
    // TODO: Kiểm tra quyền admin
    return await this.prisma.loaiCongViec.create({
      data: {
        ten_loai_cong_viec: createCategoryDto.ten_loai_cong_viec
      }
    });
  }

  async updateMainCategory(id: number, updateCategoryDto: any) {
    // TODO: Kiểm tra quyền admin
    
    const category = await this.prisma.loaiCongViec.findUnique({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    return await this.prisma.loaiCongViec.update({
      where: { id },
      data: {
        ten_loai_cong_viec: updateCategoryDto.ten_loai_cong_viec
      }
    });
  }

  async deleteMainCategory(id: number) {
    // TODO: Kiểm tra quyền admin
    
    const category = await this.prisma.loaiCongViec.findUnique({
      where: { id },
      include: {
        chiTietLoaiCongViec: true
      }
    });

    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }

    // Kiểm tra xem có danh mục con nào không
    if (category.chiTietLoaiCongViec.length > 0) {
      throw new ForbiddenException('Không thể xóa danh mục có danh mục con');
    }

    await this.prisma.loaiCongViec.delete({
      where: { id }
    });

    return { message: 'Xóa danh mục chính thành công' };
  }

  async createSubCategory(createSubCategoryDto: any) {
    // TODO: Kiểm tra quyền admin
    
    // Kiểm tra xem loại công việc chính có tồn tại không
    const mainCategory = await this.prisma.loaiCongViec.findUnique({
      where: { id: createSubCategoryDto.ma_loai_cong_viec }
    });

    if (!mainCategory) {
      throw new NotFoundException('Loại công việc chính không tồn tại');
    }

    return await this.prisma.chiTietLoaiCongViec.create({
      data: {
        ten_chi_tiet: createSubCategoryDto.ten_chi_tiet,
        hinh_anh: createSubCategoryDto.hinh_anh,
        ma_loai_cong_viec: createSubCategoryDto.ma_loai_cong_viec
      }
    });
  }

  async updateSubCategory(id: number, updateSubCategoryDto: any) {
    // TODO: Kiểm tra quyền admin
    
    const subCategory = await this.prisma.chiTietLoaiCongViec.findUnique({
      where: { id }
    });

    if (!subCategory) {
      throw new NotFoundException('Danh mục con không tồn tại');
    }

    // Nếu có cập nhật ma_loai_cong_viec, kiểm tra xem có tồn tại không
    if (updateSubCategoryDto.ma_loai_cong_viec) {
      const mainCategory = await this.prisma.loaiCongViec.findUnique({
        where: { id: updateSubCategoryDto.ma_loai_cong_viec }
      });

      if (!mainCategory) {
        throw new NotFoundException('Loại công việc chính không tồn tại');
      }
    }

    return await this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data: {
        ten_chi_tiet: updateSubCategoryDto.ten_chi_tiet,
        hinh_anh: updateSubCategoryDto.hinh_anh,
        ma_loai_cong_viec: updateSubCategoryDto.ma_loai_cong_viec
      }
    });
  }

  async deleteSubCategory(id: number) {
    // TODO: Kiểm tra quyền admin
    
    const subCategory = await this.prisma.chiTietLoaiCongViec.findUnique({
      where: { id },
      include: {
        congViec: true
      }
    });

    if (!subCategory) {
      throw new NotFoundException('Danh mục con không tồn tại');
    }

    // Kiểm tra xem có công việc nào sử dụng danh mục này không
    if (subCategory.congViec.length > 0) {
      throw new ForbiddenException('Không thể xóa danh mục con có công việc đang sử dụng');
    }

    await this.prisma.chiTietLoaiCongViec.delete({
      where: { id }
    });

    return { message: 'Xóa danh mục con thành công' };
  }
}
