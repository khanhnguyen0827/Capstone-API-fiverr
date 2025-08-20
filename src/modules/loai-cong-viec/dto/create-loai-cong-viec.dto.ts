import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoaiCongViecDto {
  @ApiProperty({ description: 'Tên loại công việc' })
  @IsString()
  ten_loai_cong_viec: string;

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
}
