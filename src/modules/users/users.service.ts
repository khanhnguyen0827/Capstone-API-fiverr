import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    page: number = 1,
    size: number = 10,
    search?: string,
    role?: string,
    skill?: string,
  ) {
    const skip = (page - 1) * size;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { skill: { contains: search } },
      ];
    }
    
    if (role) {
      where.role = role;
    }
    
    if (skill) {
      where.skill = { contains: skill };
    }

    const [users, total] = await Promise.all([
      this.prisma.users.findMany({
        where,
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
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.nguoiDung.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: users,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: number): Promise<UserResponseDto> {
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
      throw new NotFoundException(`Người dùng với ID ${id} không tồn tại`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.nguoiDung.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
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

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ): Promise<UserResponseDto> {
    // Kiểm tra quyền: chỉ admin hoặc chính người dùng đó mới được cập nhật
    const currentUser = await this.findById(currentUserId);
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException('Bạn không có quyền cập nhật người dùng này');
    }

    const user = await this.prisma.nguoiDung.update({
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

    return user;
  }

  async remove(id: number): Promise<void> {
    await this.prisma.nguoiDung.delete({
      where: { id },
    });
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    return this.findById(userId);
  }

  async getFreelancers(
    page: number = 1,
    size: number = 10,
    skill?: string,
    rating?: number,
  ) {
    const skip = (page - 1) * size;

    const where: any = {
      role: { in: ['freelancer', 'user'] }, // Bao gồm cả user thường có thể là freelancer
    };
    
    if (skill) {
      where.skill = { contains: skill };
    }

    const [users, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        where,
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
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.nguoiDung.count({ where }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: users,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getTopRatedUsers(limit: number = 10) {
    // Lấy người dùng có nhiều công việc hoàn thành nhất
    const users = await this.prisma.nguoiDung.findMany({
      take: limit,
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
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  }

  async getUserJobs(
    userId: number,
    page: number = 1,
    size: number = 10,
  ) {
    const skip = (page - 1) * size;

    const [jobs, total] = await Promise.all([
      this.prisma.congViec.findMany({
        where: { nguoi_tao: userId },
        skip,
        take: size,
        select: {
          id: true,
          ten_cong_viec: true,
          danh_gia: true,
          gia_tien: true,
          hinh_anh: true,
          mo_ta: true,
          mo_ta_ngan: true,
          sao_cong_viec: true,
        },
        orderBy: {
          id: 'desc',
        },
      }),
      this.prisma.congViec.count({
        where: { nguoi_tao: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: jobs,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getUserReviews(
    userId: number,
    page: number = 1,
    size: number = 10,
  ) {
    const skip = (page - 1) * size;

    const [reviews, total] = await Promise.all([
      this.prisma.binhLuan.findMany({
        where: { ma_nguoi_binh_luan: userId },
        skip,
        take: size,
        select: {
          id: true,
          noi_dung: true,
          sao_binh_luan: true,
          ngay_binh_luan: true,
          CongViec: {
            select: {
              id: true,
              ten_cong_viec: true,
            },
          },
        },
        orderBy: {
          ngay_binh_luan: 'desc',
        },
      }),
      this.prisma.binhLuan.count({
        where: { ma_nguoi_binh_luan: userId },
      }),
    ]);

    const totalPages = Math.ceil(total / size);

    return {
      data: reviews,
      pagination: {
        page,
        size,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async updateRole(id: number, role: string): Promise<UserResponseDto> {
    const user = await this.prisma.nguoiDung.update({
      where: { id },
      data: { role },
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

  async getStatistics() {
    const [totalUsers, totalFreelancers, totalClients, totalAdmins] = await Promise.all([
      this.prisma.nguoiDung.count(),
      this.prisma.nguoiDung.count({
        where: { role: { in: ['freelancer', 'user'] } },
      }),
      this.prisma.nguoiDung.count({
        where: { role: 'client' },
      }),
      this.prisma.nguoiDung.count({
        where: { role: 'admin' },
      }),
    ]);

    return {
      totalUsers,
      totalFreelancers,
      totalClients,
      totalAdmins,
    };
  }
}
