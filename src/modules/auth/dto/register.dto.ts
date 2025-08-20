import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Họ tên người dùng',
    example: 'Nguyễn Văn A'
  })
  @IsString()
  ho_ten: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123'
  })
  @IsString()
  password: string;

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
    example: 'USER'
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

  @ApiPropertyOptional({
    description: 'Ảnh đại diện',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsString()
  anh_dai_dien?: string;
}
