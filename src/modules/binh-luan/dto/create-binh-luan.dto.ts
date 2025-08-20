import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBinhLuanDto {
  @ApiProperty({ description: 'Mã công việc' })
  @IsNumber()
  ma_cong_viec: number;

  @ApiProperty({ description: 'Mã người bình luận' })
  @IsNumber()
  ma_nguoi_binh_luan: number;

  @ApiProperty({ description: 'Ngày bình luận', required: false })
  @IsOptional()
  @IsDateString()
  ngay_binh_luan?: string;

  @ApiProperty({ description: 'Nội dung' })
  @IsString()
  noi_dung: string;

  @ApiProperty({ description: 'Sao bình luận', required: false })
  @IsOptional()
  @IsNumber()
  sao_binh_luan?: number;
}
