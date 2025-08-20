import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await this.prisma.users.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new NotFoundException('Email đã tồn tại');
    }

    // Tạo user mới
    const user = await this.prisma.users.create({
      data: createUserDto,
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: false,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
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
        { ho_ten: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { skill: { contains: search } },
      ];
    }

    // Tính toán skip cho pagination
    const skip = (currentPage - 1) * currentPageSize;

    // Lấy danh sách users
    const users = await this.prisma.users.findMany({
      take: currentPageSize,
      skip: skip,
      orderBy: {
        created_at: 'desc',
      },
      where: where,
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: false,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Đếm tổng số users
    const totalItem = await this.prisma.users.count({
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
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: false,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: true,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với email ${email}`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Kiểm tra xem user có tồn tại không
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }

    // Kiểm tra email nếu có thay đổi
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.users.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new NotFoundException('Email đã tồn tại');
      }
    }

    // Cập nhật user
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: false,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async remove(id: number) {
    // Kiểm tra xem user có tồn tại không
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }

    // Xóa user (soft delete)
    await this.prisma.users.update({
      where: { id },
      data: { is_deleted: true },
    });

    return { message: `Đã xóa user với ID ${id}` };
  }

  async updatePassword(id: number, newPassword: string) {
    // Kiểm tra xem user có tồn tại không
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }

    // Cập nhật mật khẩu
    await this.prisma.users.update({
      where: { id },
      data: { pass_word: newPassword },
    });

    return { message: 'Mật khẩu đã được cập nhật' };
  }

  async updateAvatar(id: number, avatarUrl: string) {
    // Kiểm tra xem user có tồn tại không
    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Không tìm thấy user với ID ${id}`);
    }

    // Cập nhật avatar
    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: { anh_dai_dien: avatarUrl },
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: false,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async findByRole(role: string) {
    const users = await this.prisma.users.findMany({
      where: {
        role: role,
        is_deleted: false,
        is_active: true,
      },
      select: {
        id: true,
        ho_ten: true,
        email: true,
        phone: true,
        pass_word: false,
        birth_day: true,
        gender: true,
        role: true,
        skill: true,
        certification: true,
        anh_dai_dien: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  }
}
