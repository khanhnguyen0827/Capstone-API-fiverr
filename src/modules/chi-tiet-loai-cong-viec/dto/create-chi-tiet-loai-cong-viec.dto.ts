import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateChiTietLoaiCongViecDto {
  @IsString()
  ten_chi_tiet: string;

  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @IsOptional()
  @IsInt()
  ma_loai_cong_viec?: number;
}
