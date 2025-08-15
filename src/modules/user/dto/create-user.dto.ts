import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { USER_ROLES, GENDER_OPTIONS, VALIDATION_MESSAGES } from '../../../common/constant/app.constant';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email người dùng (phải là duy nhất)',
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
    enum: GENDER_OPTIONS,
    type: String,
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Vai trò người dùng',
    example: 'freelancer',
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.USER,
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
