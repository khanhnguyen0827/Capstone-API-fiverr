import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { USER_ROLES, RESPONSE_MESSAGES, SECURITY_CONFIG } from '../../common/constant/app.constant';
import { BaseService } from '../../common/base';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends BaseService {
  constructor(private prisma: PrismaService) {
    super('UsersService');
  }

  async getUsers(page: number, size: number) {
    this.logOperation('getUsers', { page, size });
    
    const { page: validPage, size: validSize, skip } = this.validatePagination(page, size);
    
    const [users, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        skip,
        take: validSize,
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
        orderBy: { id: 'desc' },
      }),
      this.prisma.nguoiDung.count(),
    ]);

    const pagination = this.createPaginationInfo(validPage, validSize, total);

    return {
      data: users,
      pagination,
    };
  }

  async getUserById(id: number) {
    this.logOperation('getUserById', { id });
    
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
      this.logError('getUserById', { id, error: 'User not found' });
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    this.logOperation('createUser', { email: createUserDto.email });
    
    const { email, pass_word, ...userData } = createUserDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });

    if (existingUser) {
      this.logError('createUser', { email, error: 'Email already exists' });
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

    this.logOperation('createUser success', { userId: newUser.id });
    return newUser;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    this.logOperation('updateUser', { id, currentUserId: currentUser.userId });
    
    // Kiểm tra quyền
    if (currentUser.userId !== id && currentUser.role !== USER_ROLES.ADMIN) {
      this.logError('updateUser', { id, currentUserId: currentUser.userId, error: 'Forbidden' });
      throw new ForbiddenException(RESPONSE_MESSAGES.FORBIDDEN);
    }

    const user = await this.prisma.nguoiDung.findUnique({
      where: { id },
    });

    if (!user) {
      this.logError('updateUser', { id, error: 'User not found' });
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

    this.logOperation('updateUser success', { id });
    return updatedUser;
  }

  async deleteUser(id: number, currentUser: any) {
    this.logOperation('deleteUser', { id, currentUserId: currentUser.userId });
    
    // Kiểm tra quyền
    if (currentUser.userId !== id && currentUser.role !== USER_ROLES.ADMIN) {
      this.logError('deleteUser', { id, currentUserId: currentUser.userId, error: 'Forbidden' });
      throw new ForbiddenException(RESPONSE_MESSAGES.FORBIDDEN);
    }

    const user = await this.prisma.nguoiDung.findUnique({
      where: { id },
    });

    if (!user) {
      this.logError('deleteUser', { id, error: 'User not found' });
      throw new NotFoundException(RESPONSE_MESSAGES.NOT_FOUND);
    }

    await this.prisma.nguoiDung.delete({
      where: { id },
    });

    this.logOperation('deleteUser success', { id });
    return { message: RESPONSE_MESSAGES.DELETED };
  }
}
