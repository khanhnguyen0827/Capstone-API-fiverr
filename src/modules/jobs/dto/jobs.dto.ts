import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({
    description: 'Tên công việc',
    example: 'Thiết kế website bán hàng',
    type: String,
  })
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  @IsString()
  ten_cong_viec: string;

  @ApiProperty({
    description: 'Giá tiền (VNĐ)',
    example: 5000000,
    type: Number,
  })
  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  @IsNumber()
  gia_tien: number;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết công việc',
    example: 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp và responsive',
    type: String,
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn gọn công việc',
    example: 'Website bán hàng responsive',
    type: String,
  })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh minh họa công việc',
    example: 'https://example.com/images/website-design.jpg',
    type: String,
  })
  @IsOptional()
  @IsUrl()
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID danh mục chi tiết công việc',
    example: 4,
    type: Number,
  })
  @IsNotEmpty({ message: 'Danh mục công việc không được để trống' })
  @IsNumber()
  ma_chi_tiet_loai: number;
}

export class UpdateJobDto {
  @ApiPropertyOptional({
    description: 'Tên công việc',
    example: 'Thiết kế website bán hàng (Updated)',
    type: String,
  })
  @IsOptional()
  @IsString()
  ten_cong_viec?: string;

  @ApiPropertyOptional({
    description: 'Giá tiền (VNĐ)',
    example: 6000000,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  gia_tien?: number;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết công việc',
    example: 'Thiết kế website bán hàng chuyên nghiệp với giao diện đẹp, responsive và SEO tối ưu',
    type: String,
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn gọn công việc',
    example: 'Website bán hàng responsive với SEO',
    type: String,
  })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiPropertyOptional({
    description: 'URL hình ảnh minh họa công việc',
    example: 'https://example.com/images/website-design-updated.jpg',
    type: String,
  })
  @IsOptional()
  @IsUrl()
  hinh_anh?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục chi tiết công việc',
    example: 4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  ma_chi_tiet_loai?: number;
}

export class JobSearchDto {
  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm',
    example: 'website',
    type: String,
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục công việc',
    example: 4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Giá tiền tối thiểu',
    example: 1000000,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Giá tiền tối đa',
    example: 10000000,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Số sao đánh giá',
    example: 4,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;
}
