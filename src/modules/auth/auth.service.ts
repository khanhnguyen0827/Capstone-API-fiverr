import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    let { page, pageSize, filters } = query;

    // Xử lý pagination
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 10;

    // Xử lý filters
    let parsedFilters = {};
    try {
      parsedFilters = JSON.parse(filters || '{}');
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
    const skip = (page - 1) * pageSize;

    // Lấy danh sách người dùng
    const users = await this.prisma.nguoiDung.findMany({
      take: pageSize,
      skip: skip,
      orderBy: {
        id: 'desc',
      },
      where: where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
      },
    });

    // Đếm tổng số người dùng
    const totalItem = await this.prisma.nguoiDung.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: users,
    };
  }
}
