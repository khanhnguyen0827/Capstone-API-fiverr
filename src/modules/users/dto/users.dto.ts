import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'nguyenvana@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
  })
  @IsString()
  pass_word: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  birth_day?: string;

  @ApiProperty({
    description: 'Giới tính',
    example: 'Nam',
    enum: ['Nam', 'Nữ', 'Khác'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Nam', 'Nữ', 'Khác'])
  gender?: string;

  @ApiProperty({
    description: 'Vai trò',
    example: 'freelancer',
    enum: ['user', 'freelancer', 'admin'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['user', 'freelancer', 'admin'])
  role?: string;

  @ApiProperty({
    description: 'Kỹ năng',
    example: 'Lập trình web, React, Node.js',
    required: false,
  })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiProperty({
    description: 'Chứng chỉ',
    example: 'AWS Certified Developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  certification?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A (Đã cập nhật)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Ngày sinh',
    example: '1990-01-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  birth_day?: string;

  @ApiProperty({
    description: 'Giới tính',
    example: 'Nam',
    enum: ['Nam', 'Nữ', 'Khác'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['Nam', 'Nữ', 'Khác'])
  gender?: string;

  @ApiProperty({
    description: 'Kỹ năng',
    example: 'Lập trình web, React, Node.js',
    required: false,
  })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiProperty({
    description: 'Chứng chỉ',
    example: 'AWS Certified Developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  certification?: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  name: string;

  @ApiProperty({ example: 'nguyenvana@email.com' })
  email: string;

  @ApiProperty({ example: '0123456789' })
  phone?: string | null;

  @ApiProperty({ example: '1990-01-01' })
  birth_day?: string | null;

  @ApiProperty({ example: 'Nam' })
  gender?: string | null;

  @ApiProperty({ example: 'freelancer' })
  role?: string | null;

  @ApiProperty({ example: 'Lập trình web, React, Node.js' })
  skill?: string | null;

  @ApiProperty({ example: 'AWS Certified Developer' })
  certification?: string | null;
}
