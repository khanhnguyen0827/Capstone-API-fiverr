import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email đăng nhập',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  pass_word: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Tên người dùng',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email đăng ký',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
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
    required: false,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({
    description: 'Vai trò',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsString()
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

export class AuthResponseDto {
  @ApiProperty({
    description: 'Mã trạng thái',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Thông báo',
    example: 'Đăng nhập thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Dữ liệu phản hồi',
  })
  data: {
    access_token: string;
    refresh_token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}
