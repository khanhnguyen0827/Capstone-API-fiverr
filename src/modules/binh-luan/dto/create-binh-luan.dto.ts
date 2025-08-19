import { IsString, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBinhLuanDto {
  @ApiPropertyOptional({
    description: 'Mã công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @ApiPropertyOptional({
    description: 'Mã người bình luận',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_nguoi_binh_luan?: number;

  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Công việc rất tốt, giao hàng đúng hạn!'
  })
  @IsString()
  noi_dung: string;

  @ApiPropertyOptional({
    description: 'Sao đánh giá (0-5)',
    minimum: 0,
    maximum: 5,
    example: 5
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  sao_binh_luan?: number;
}
