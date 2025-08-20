import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Email của người dùng' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mật khẩu' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Họ tên' })
  @IsString()
  ho_ten: string;

  @ApiProperty({ description: 'Số điện thoại', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Ngày sinh', required: false })
  @IsOptional()
  @IsString()
  birth_day?: string;

  @ApiProperty({ description: 'Giới tính', required: false, enum: ['MALE', 'FEMALE', 'OTHER'] })
  @IsOptional()
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender?: string;

  @ApiProperty({ description: 'Vai trò', required: false, enum: ['USER', 'ADMIN', 'MODERATOR'] })
  @IsOptional()
  @IsEnum(['USER', 'ADMIN', 'MODERATOR'])
  role?: string;

  @ApiProperty({ description: 'Kỹ năng', required: false })
  @IsOptional()
  @IsString()
  skill?: string;

  @ApiProperty({ description: 'Chứng chỉ', required: false })
  @IsOptional()
  @IsString()
  certification?: string;

  @ApiProperty({ description: 'Ảnh đại diện', required: false })
  @IsOptional()
  @IsString()
  anh_dai_dien?: string;

  @ApiProperty({ description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
