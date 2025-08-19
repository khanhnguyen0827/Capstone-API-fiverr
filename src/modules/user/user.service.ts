import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    const user = await this.prisma.nguoiDung.create({
      data: createUserDto,
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

    return user;
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

    // Lấy danh sách người dùng
    const users = await this.prisma.nguoiDung.findMany({
      take: currentPageSize,
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
      }
    });

    // Đếm tổng số người dùng
    const totalItem = await this.prisma.nguoiDung.count({
      where: where,
    });

    const totalPage = Math.ceil(totalItem / currentPageSize);

    return {
      page: currentPage,
      pageSize: currentPageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: users,
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.nguoiDung.findUnique({
      where: { id },
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

    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với ID: ${id}`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Kiểm tra user có tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với ID: ${id}`);
    }

    // Nếu có email mới, kiểm tra email đã tồn tại
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.nguoiDung.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email đã tồn tại');
      }
    }

    const updatedUser = await this.prisma.nguoiDung.update({
      where: { id },
      data: updateUserDto,
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

    return updatedUser;
  }

  async remove(id: number) {
    // Kiểm tra user có tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với ID: ${id}`);
    }

    await this.prisma.nguoiDung.delete({
      where: { id },
    });

    return { message: 'Xóa user thành công' };
  }
}
