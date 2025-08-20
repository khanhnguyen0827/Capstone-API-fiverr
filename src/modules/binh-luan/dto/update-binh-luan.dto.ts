import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsInt, Min, Max } from 'class-validator';
import { CreateBinhLuanDto } from './create-binh-luan.dto';

export class UpdateBinhLuanDto extends PartialType(CreateBinhLuanDto) {
  @ApiPropertyOptional({
    description: 'ID công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @ApiPropertyOptional({
    description: 'ID người bình luận',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_nguoi_binh_luan?: number;

  @ApiPropertyOptional({
    description: 'Nội dung bình luận',
    example: 'Công việc rất tốt, tôi rất hài lòng!'
  })
  @IsOptional()
  @IsString()
  noi_dung?: string;

  @ApiPropertyOptional({
    description: 'Số sao đánh giá',
    example: 5
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  sao_binh_luan?: number;
}
