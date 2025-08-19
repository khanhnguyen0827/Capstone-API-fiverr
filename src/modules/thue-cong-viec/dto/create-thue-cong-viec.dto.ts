import { IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateThueCongViecDto {
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @IsOptional()
  @IsInt()
  ma_nguoi_thue?: number;

  @IsOptional()
  @IsBoolean()
  hoan_thanh?: boolean;
}
