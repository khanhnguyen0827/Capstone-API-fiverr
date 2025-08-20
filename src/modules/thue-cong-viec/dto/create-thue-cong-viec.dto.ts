import { IsString, IsOptional, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThueCongViecDto {
  @ApiProperty({ description: 'Mã công việc' })
  @IsNumber()
  ma_cong_viec: number;

  @ApiProperty({ description: 'Mã người thuê' })
  @IsNumber()
  ma_nguoi_thue: number;

  @ApiProperty({ description: 'Mã người làm' })
  @IsNumber()
  ma_nguoi_lam: number;

  @ApiProperty({ description: 'Ngày thuê', required: false })
  @IsOptional()
  @IsDateString()
  ngay_thue?: string;

  @ApiProperty({ description: 'Ngày bắt đầu', required: false })
  @IsOptional()
  @IsDateString()
  ngay_bat_dau?: string;

  @ApiProperty({ description: 'Ngày hoàn thành', required: false })
  @IsOptional()
  @IsDateString()
  ngay_hoan_thanh?: string;

  @ApiProperty({ description: 'Hoàn thành', required: false })
  @IsOptional()
  @IsBoolean()
  hoan_thanh?: boolean;

  @ApiProperty({ description: 'Trạng thái', required: false, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] })
  @IsOptional()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  trang_thai?: string;

  @ApiProperty({ description: 'Ghi chú', required: false })
  @IsOptional()
  @IsString()
  ghi_chu?: string;

  @ApiProperty({ description: 'Đánh giá', required: false })
  @IsOptional()
  @IsNumber()
  danh_gia?: number;

  @ApiProperty({ description: 'Nội dung đánh giá', required: false })
  @IsOptional()
  @IsString()
  noi_dung_danh_gia?: string;
}
