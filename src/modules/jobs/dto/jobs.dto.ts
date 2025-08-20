import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateJobDto {
  @ApiProperty({
    description: 'Tên công việc',
    example: 'Thiết kế website responsive',
  })
  @IsString()
  ten_cong_viec: string;

  @ApiProperty({
    description: 'Giá tiền',
    example: 2000000,
  })
  @IsNumber()
  @Min(0)
  gia_tien: number;

  @ApiProperty({
    description: 'Mô tả công việc',
    example: 'Thiết kế website responsive chuyên nghiệp',
    required: false,
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({
    description: 'Mô tả ngắn',
    example: 'Thiết kế website responsive',
    required: false,
  })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiProperty({
    description: 'Hình ảnh',
    example: 'website-design.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID chi tiết loại công việc',
    example: 1,
  })
  @IsInt()
  ma_chi_tiet_loai: number;
}

export class UpdateJobDto {
  @ApiProperty({
    description: 'Tên công việc',
    example: 'Thiết kế website responsive (Đã cập nhật)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ten_cong_viec?: string;

  @ApiProperty({
    description: 'Giá tiền',
    example: 2500000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gia_tien?: number;

  @ApiProperty({
    description: 'Mô tả công việc',
    example: 'Thiết kế website responsive chuyên nghiệp với UI/UX hiện đại',
    required: false,
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({
    description: 'Mô tả ngắn',
    example: 'Thiết kế website responsive (Đã cập nhật)',
    required: false,
  })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiProperty({
    description: 'Hình ảnh',
    example: 'website-design-updated.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID chi tiết loại công việc',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  ma_chi_tiet_loai?: number;
}

export class JobResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Thiết kế website responsive' })
  ten_cong_viec: string;

  @ApiProperty({ example: 5 })
  danh_gia?: number | null;

  @ApiProperty({ example: 2000000 })
  gia_tien: number;

  @ApiProperty({ example: 'website-design.jpg' })
  hinh_anh?: string | null;

  @ApiProperty({ example: 'Thiết kế website responsive chuyên nghiệp' })
  mo_ta?: string | null;

  @ApiProperty({ example: 'Thiết kế website responsive' })
  mo_ta_ngan?: string | null;

  @ApiProperty({ example: 5 })
  sao_cong_viec?: number | null;

  @ApiProperty({ example: 1 })
  ma_chi_tiet_loai?: number | null;

  @ApiProperty({ example: 1 })
  nguoi_tao?: number | null;
}

export class JobSearchDto {
  @ApiProperty({
    description: 'Từ khóa tìm kiếm',
    example: 'website',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'ID danh mục',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  category?: number;

  @ApiProperty({
    description: 'Giá tiền tối thiểu',
    example: 1000000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({
    description: 'Giá tiền tối đa',
    example: 5000000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiProperty({
    description: 'Đánh giá tối thiểu',
    example: 4,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  minRating?: number;
}
