import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';
import { CreateCongViecDto } from './create-cong-viec.dto';

export class UpdateCongViecDto extends PartialType(CreateCongViecDto) {
  @ApiPropertyOptional({
    description: 'Tên công việc',
    example: 'Thiết kế website responsive'
  })
  @IsOptional()
  @IsString()
  ten_cong_viec?: string;

  @ApiPropertyOptional({
    description: 'Đánh giá công việc',
    example: 5
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  danh_gia?: number;

  @ApiPropertyOptional({
    description: 'Giá tiền',
    example: 1000000
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gia_tien?: number;

  @ApiPropertyOptional({
    description: 'Hình ảnh công việc',
    example: 'https://example.com/image.jpg'
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết',
    example: 'Thiết kế website responsive cho công ty ABC'
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn gọn',
    example: 'Thiết kế website responsive'
  })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiPropertyOptional({
    description: 'Số sao đánh giá',
    example: 5
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  sao_cong_viec?: number;

  @ApiPropertyOptional({
    description: 'ID chi tiết loại công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_chi_tiet_loai?: number;

  @ApiPropertyOptional({
    description: 'ID người tạo',
    example: 1
  })
  @IsOptional()
  @IsInt()
  nguoi_tao?: number;
}
