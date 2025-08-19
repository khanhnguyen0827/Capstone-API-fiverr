import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { CreateChiTietLoaiCongViecDto } from './create-chi-tiet-loai-cong-viec.dto';

export class UpdateChiTietLoaiCongViecDto extends PartialType(CreateChiTietLoaiCongViecDto) {
  @ApiPropertyOptional({
    description: 'Tên chi tiết loại công việc',
    example: 'Lập trình web'
  })
  @IsOptional()
  @IsString()
  ten_chi_tiet?: string;

  @ApiPropertyOptional({
    description: 'Hình ảnh',
    example: 'https://example.com/image.jpg'
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiPropertyOptional({
    description: 'ID loại công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_loai_cong_viec?: number;
}
