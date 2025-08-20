import { IsEmail, IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { APP_CONSTANTS } from '../../common/constants/app.constants';

export class CreateUserDto {
  @ApiProperty({
    description: 'Họ tên người dùng',
    example: 'Nguyễn Văn A'
  })
  @IsString()
  @MinLength(APP_CONSTANTS.VALIDATION.NAME_MIN_LENGTH)
  @MaxLength(APP_CONSTANTS.VALIDATION.NAME_MAX_LENGTH)
  ho_ten: string;

  @ApiProperty({
    description: 'Email người dùng',
    example: 'user@example.com'
  })
  @IsEmail()
  @MaxLength(APP_CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH)
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123'
  })
  @IsString()
  @MinLength(APP_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH)
  @MaxLength(APP_CONSTANTS.VALIDATION.PASSWORD_MAX_LENGTH)
  password: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại',
    example: '0123456789'
  })
  @IsOptional()
  @IsString()
  @MaxLength(APP_CONSTANTS.VALIDATION.PHONE_MAX_LENGTH)
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
    example: 'USER',
    enum: Object.values(APP_CONSTANTS.ROLES)
  })
  @IsOptional()
  @IsEnum(Object.values(APP_CONSTANTS.ROLES))
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
