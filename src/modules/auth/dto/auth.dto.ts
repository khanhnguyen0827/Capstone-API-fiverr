import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VALIDATION_MESSAGES } from '../../../common/constant/app.constant';

export class AuthDto {
  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'user@example.com',
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Email đăng ký',
    example: 'user@example.com',
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (tối thiểu 6 ký tự)',
    example: 'password123',
    minLength: 6,
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @IsString()
  @MinLength(6, { message: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH })
  pass_word: string;

  @ApiProperty({
    description: 'Họ và tên người dùng',
    example: 'Nguyễn Văn A',
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.NAME_REQUIRED })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0123456789',
    type: String,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Ngày sinh',
    example: '1990-01-01',
    type: String,
  })
  @IsOptional()
  @IsString()
  birth_day?: string;

  @ApiPropertyOptional({
    description: 'Giới tính',
    example: 'Nam',
    enum: ['Nam', 'Nữ', 'Khác'],
    type: String,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Vai trò người dùng',
    example: 'freelancer',
    enum: ['user', 'freelancer', 'client', 'admin'],
    default: 'user',
    type: String,
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Kỹ năng chuyên môn',
    example: 'Lập trình web, React, Node.js',
    type: String,
  })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiPropertyOptional({
    description: 'Chứng chỉ',
    example: 'AWS Certified Developer',
    type: String,
  })
  @IsOptional()
  @IsString()
  certification?: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'user@example.com',
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.EMAIL_REQUIRED })
  @IsEmail({}, { message: VALIDATION_MESSAGES.EMAIL_INVALID })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    type: String,
  })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @IsString()
  pass_word: string;
}
