import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  @IsString()
  ten_cong_viec: string;

  @IsNotEmpty({ message: 'Giá tiền không được để trống' })
  @IsNumber()
  gia_tien: number;

  @IsOptional()
  @IsString()
  mo_ta?: string;

  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @IsOptional()
  @IsUrl()
  hinh_anh?: string;

  @IsNotEmpty({ message: 'Danh mục công việc không được để trống' })
  @IsNumber()
  ma_chi_tiet_loai: number;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  ten_cong_viec?: string;

  @IsOptional()
  @IsNumber()
  gia_tien?: number;

  @IsOptional()
  @IsString()
  mo_ta?: string;

  @IsOptional()
  @IsString()
  mo_ta_ngan?: string;

  @IsOptional()
  @IsUrl()
  hinh_anh?: string;

  @IsOptional()
  @IsNumber()
  ma_chi_tiet_loai?: number;
}
