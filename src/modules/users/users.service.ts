import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { USER_ROLES, RESPONSE_MESSAGES, SECURITY_CONFIG } from '../../common/constant/app.constant';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(page: number, size: number) {
    const skip = (page - 1) * size;
    
    const [users, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        skip,
        take: size,
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
      }),
      this.prisma.nguoiDung.count(),
    ]);

    return {
      data: users,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    };
  }

  async getUserById(id: number) {
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
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, pass_word, ...userData } = createUserDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ForbiddenException('Email đã tồn tại');
    }

    // Hash password với số rounds từ config
    const hashedPassword = await bcrypt.hash(pass_word, SECURITY_CONFIG.bcryptRounds);

    // Tạo user mới
    const newUser = await this.prisma.nguoiDung.create({
      data: {
        ...userData,
        email,
        pass_word: hashedPassword,
        role: userData.role || USER_ROLES.USER,
      },
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

    return newUser;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    // Kiểm tra quyền
    if (currentUser.userId !== id && currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException(RESPONSE_MESSAGES.FORBIDDEN);
    }

    const user = await this.prisma.nguoiDung.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    // Hash password nếu có cập nhật
    let updateData = { ...updateUserDto };
    if (updateUserDto.pass_word) {
      updateData.pass_word = await bcrypt.hash(updateUserDto.pass_word, SECURITY_CONFIG.bcryptRounds);
    }

    const updatedUser = await this.prisma.nguoiDung.update({
      where: { id },
      data: updateData,
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

  async deleteUser(id: number, currentUser: any) {
    // Kiểm tra quyền
    if (currentUser.userId !== id && currentUser.role !== USER_ROLES.ADMIN) {
      throw new ForbiddenException(RESPONSE_MESSAGES.FORBIDDEN);
    }

    const user = await this.prisma.nguoiDung.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    await this.prisma.nguoiDung.delete({
      where: { id },
    });

    return { message: RESPONSE_MESSAGES.DELETED };
  }
}
