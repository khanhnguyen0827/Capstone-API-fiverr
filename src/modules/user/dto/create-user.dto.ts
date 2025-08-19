import { IsEmail, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A'
  })
  @IsString()
  name: string;

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
  pass_word: string;

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
