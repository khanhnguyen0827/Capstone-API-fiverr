import { IsString, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateBinhLuanDto {
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @IsOptional()
  @IsInt()
  ma_nguoi_binh_luan?: number;

  @IsString()
  noi_dung: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  sao_binh_luan?: number;
}
