import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCongViecDto {
  @ApiProperty({
    description: 'Tên công việc',
    example: 'Thiết kế website responsive'
  })
  @IsString()
  ten_cong_viec: string;

  @ApiPropertyOptional({
    description: 'Đánh giá',
    minimum: 0,
    example: 5
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  danh_gia?: number;

  @ApiProperty({
    description: 'Giá tiền',
    minimum: 0,
    example: 1000000
  })
  @IsNumber()
  @Min(0)
  gia_tien: number;

  @ApiPropertyOptional({
    description: 'Hình ảnh',
    example: 'https://example.com/image.jpg'
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết',
    example: 'Thiết kế website responsive với HTML5, CSS3, JavaScript'
  })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiPropertyOptional({
    description: 'Mô tả ngắn',
    example: 'Website responsive cho công ty'
  })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiPropertyOptional({
    description: 'Sao đánh giá',
    minimum: 0,
    example: 5
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sao_cong_viec?: number;

  @ApiPropertyOptional({
    description: 'Mã chi tiết loại công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_chi_tiet_loai?: number;

  @ApiPropertyOptional({
    description: 'Người tạo công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  nguoi_tao?: number;
}
