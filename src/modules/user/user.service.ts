import { Injectable, NotFoundException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createUserDto.email)) {
        throw new BadRequestException('Email không hợp lệ');
      }

      // Validate phone format (optional)
      if (createUserDto.phone) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(createUserDto.phone)) {
          throw new BadRequestException('Số điện thoại không hợp lệ');
        }
      }

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

      this.logger.log(`User created successfully: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`User creation failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(query: any = {}) {
    try {
      const { page = 1, pageSize = 10, filters = '{}', search = '' } = query;
      
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
          { name: { contains: search.trim(), mode: 'insensitive' } },
          { email: { contains: search.trim(), mode: 'insensitive' } },
          { skill: { contains: search.trim(), mode: 'insensitive' } },
        ];
      }

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
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID không hợp lệ');
      }

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
    } catch (error) {
      this.logger.error(`Failed to fetch user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID không hợp lệ');
      }

      // Validate email format if provided
      if (updateUserDto.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updateUserDto.email)) {
          throw new BadRequestException('Email không hợp lệ');
        }
      }

      // Validate phone format if provided
      if (updateUserDto.phone) {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(updateUserDto.phone)) {
          throw new BadRequestException('Số điện thoại không hợp lệ');
        }
      }

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

      this.logger.log(`User updated successfully: ${updatedUser.email}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID không hợp lệ');
      }

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

      this.logger.log(`User deleted successfully: ${existingUser.email}`);
      return { message: 'Xóa user thành công' };
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}
