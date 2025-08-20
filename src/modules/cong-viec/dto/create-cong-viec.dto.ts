import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCongViecDto {
  @ApiProperty({ description: 'Tên công việc' })
  @IsString()
  ten_cong_viec: string;

  @ApiProperty({ description: 'Đánh giá', required: false })
  @IsOptional()
  @IsNumber()
  danh_gia?: number;

  @ApiProperty({ description: 'Giá tiền' })
  @IsNumber()
  gia_tien: number;

  @ApiProperty({ description: 'Hình ảnh', required: false })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({ description: 'Mô tả', required: false })
  @IsOptional()
  @IsString()
  mo_ta?: string;

  @ApiProperty({ description: 'Mô tả ngắn', required: false })
  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @ApiProperty({ description: 'Sao công việc', required: false })
  @IsOptional()
  @IsNumber()
  sao_cong_viec?: number;

  @ApiProperty({ description: 'Mã chi tiết loại' })
  @IsNumber()
  ma_chi_tiet_loai: number;

  @ApiProperty({ description: 'Người tạo' })
  @IsNumber()
  nguoi_tao: number;

  @ApiProperty({ description: 'Trạng thái', required: false, enum: ['AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['AVAILABLE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  trang_thai?: string;

  @ApiProperty({ description: 'Số lượng đã thuê', required: false })
  @IsOptional()
  @IsNumber()
  so_luong_da_thue?: number;

  @ApiProperty({ description: 'Số lượng đã hoàn thành', required: false })
  @IsOptional()
  @IsNumber()
  so_luong_da_hoan_thanh?: number;
}
