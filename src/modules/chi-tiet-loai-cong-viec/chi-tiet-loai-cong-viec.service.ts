import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChiTietLoaiCongViecDto } from './dto/create-chi-tiet-loai-cong-viec.dto';
import { UpdateChiTietLoaiCongViecDto } from './dto/update-chi-tiet-loai-cong-viec.dto';

@Injectable()
export class ChiTietLoaiCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createChiTietLoaiCongViecDto: CreateChiTietLoaiCongViecDto) {
    const chiTietLoaiCongViec = await this.prisma.chiTietLoaiCongViec.create({
      data: createChiTietLoaiCongViecDto,
      include: {
        LoaiCongViec: true,
        CongViec: true,
      },
    });

    return chiTietLoaiCongViec;
  }

  async findAll() {
    return await this.prisma.chiTietLoaiCongViec.findMany({
      include: {
        LoaiCongViec: true,
        CongViec: true,
      },
    });
  }

  async findOne(id: number) {
    const chiTietLoaiCongViec = await this.prisma.chiTietLoaiCongViec.findUnique({
      where: { id },
      include: {
        LoaiCongViec: true,
        CongViec: true,
      },
    });

    if (!chiTietLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID: ${id}`);
    }

    return chiTietLoaiCongViec;
  }

  async update(id: number, updateChiTietLoaiCongViecDto: UpdateChiTietLoaiCongViecDto) {
    // Kiểm tra chi tiết loại công việc có tồn tại
    const existingChiTietLoaiCongViec = await this.prisma.chiTietLoaiCongViec.findUnique({
      where: { id },
    });

    if (!existingChiTietLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID: ${id}`);
    }

    const updatedChiTietLoaiCongViec = await this.prisma.chiTietLoaiCongViec.update({
      where: { id },
      data: updateChiTietLoaiCongViecDto,
      include: {
        LoaiCongViec: true,
        CongViec: true,
      },
    });

    return updatedChiTietLoaiCongViec;
  }

  async remove(id: number) {
    // Kiểm tra chi tiết loại công việc có tồn tại
    const existingChiTietLoaiCongViec = await this.prisma.chiTietLoaiCongViec.findUnique({
      where: { id },
    });

    if (!existingChiTietLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy chi tiết loại công việc với ID: ${id}`);
    }

    await this.prisma.chiTietLoaiCongViec.delete({
      where: { id },
    });

    return { message: 'Xóa chi tiết loại công việc thành công' };
  }

  async findByLoaiCongViec(maLoaiCongViec: number) {
    return await this.prisma.chiTietLoaiCongViec.findMany({
      where: { ma_loai_cong_viec: maLoaiCongViec },
      include: {
        LoaiCongViec: true,
        CongViec: true,
      },
    });
  }
}
