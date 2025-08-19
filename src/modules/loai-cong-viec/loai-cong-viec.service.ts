import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoaiCongViecDto } from './dto/create-loai-cong-viec.dto';
import { UpdateLoaiCongViecDto } from './dto/update-loai-cong-viec.dto';

@Injectable()
export class LoaiCongViecService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLoaiCongViecDto: CreateLoaiCongViecDto) {
    const loaiCongViec = await this.prisma.loaiCongViec.create({
      data: createLoaiCongViecDto,
      include: {
        ChiTietLoaiCongViec: true,
      },
    });

    return loaiCongViec;
  }

  async findAll() {
    return await this.prisma.loaiCongViec.findMany({
      include: {
        ChiTietLoaiCongViec: true,
      },
    });
  }

  async findOne(id: number) {
    const loaiCongViec = await this.prisma.loaiCongViec.findUnique({
      where: { id },
      include: {
        ChiTietLoaiCongViec: true,
      },
    });

    if (!loaiCongViec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID: ${id}`);
    }

    return loaiCongViec;
  }

  async update(id: number, updateLoaiCongViecDto: UpdateLoaiCongViecDto) {
    // Kiểm tra loại công việc có tồn tại
    const existingLoaiCongViec = await this.prisma.loaiCongViec.findUnique({
      where: { id },
    });

    if (!existingLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID: ${id}`);
    }

    const updatedLoaiCongViec = await this.prisma.loaiCongViec.update({
      where: { id },
      data: updateLoaiCongViecDto,
      include: {
        ChiTietLoaiCongViec: true,
      },
    });

    return updatedLoaiCongViec;
  }

  async remove(id: number) {
    // Kiểm tra loại công việc có tồn tại
    const existingLoaiCongViec = await this.prisma.loaiCongViec.findUnique({
      where: { id },
    });

    if (!existingLoaiCongViec) {
      throw new NotFoundException(`Không tìm thấy loại công việc với ID: ${id}`);
    }

    await this.prisma.loaiCongViec.delete({
      where: { id },
    });

    return { message: 'Xóa loại công việc thành công' };
  }
}
