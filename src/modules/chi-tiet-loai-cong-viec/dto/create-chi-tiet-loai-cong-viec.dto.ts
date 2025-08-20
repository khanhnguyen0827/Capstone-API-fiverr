import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChiTietLoaiCongViecDto {
  @ApiProperty({ description: 'Tên chi tiết' })
  @IsString()
  ten_chi_tiet: string;

  @ApiProperty({ description: 'Hình ảnh', required: false })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({ description: 'Thứ tự', required: false })
  @IsOptional()
  @IsNumber()
  thu_tu?: number;

  @ApiProperty({ description: 'Mã loại công việc' })
  @IsNumber()
  ma_loai_cong_viec: number;
}
