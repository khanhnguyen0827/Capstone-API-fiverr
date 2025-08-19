import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Email người dùng',
    example: 'user@example.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Mật khẩu',
    example: 'password123'
  })
  @IsOptional()
  @IsString()
  pass_word?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0123456789'
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Ngày sinh',
    example: '1990-01-01'
  })
  @IsOptional()
  @IsString()
  birth_day?: string;

  @ApiPropertyOptional({
    description: 'Giới tính',
    enum: ['male', 'female', 'other'],
    example: 'male'
  })
  @IsOptional()
  @IsEnum(['male', 'female', 'other'])
  gender?: string;

  @ApiPropertyOptional({
    description: 'Vai trò',
    example: 'user'
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Kỹ năng',
    example: 'JavaScript, React, Node.js'
  })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional({
    description: 'Chứng chỉ',
    example: 'AWS Certified Developer, Google Cloud Professional'
  })
  @IsOptional()
  @IsString()
  certification?: string;
}
