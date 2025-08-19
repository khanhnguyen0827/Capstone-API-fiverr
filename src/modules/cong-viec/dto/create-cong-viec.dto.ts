import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCongViecDto {
  @IsString()
  ten_cong_viec: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  danh_gia?: number;

  @IsNumber()
  @Min(0)
  gia_tien: number;

  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @IsOptional()
  @IsString()
  mo_ta?: string;

  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sao_cong_viec?: number;

  @IsOptional()
  @IsInt()
  ma_chi_tiet_loai?: number;

  @IsOptional()
  @IsInt()
  nguoi_tao?: number;
}
