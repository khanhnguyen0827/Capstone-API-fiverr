import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID công việc',
    example: 1,
    type: Number,
  })
  @IsNotEmpty({ message: 'ID công việc không được để trống' })
  @IsNumber()
  ma_cong_viec: number;

  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Dự án rất tốt, giao diện đẹp!',
    type: String,
  })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @IsString()
  noi_dung: string;

  @ApiPropertyOptional({
    description: 'Số sao đánh giá (1-5)',
    example: 5,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Số sao phải từ 1-5' })
  @Max(5, { message: 'Số sao phải từ 1-5' })
  sao_binh_luan?: number;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({
    description: 'Nội dung bình luận',
    example: 'Dự án rất tốt, giao diện đẹp và chuyên nghiệp!',
    type: String,
  })
  @IsOptional()
  @IsString()
  noi_dung?: string;

  @ApiPropertyOptional({
    description: 'Số sao đánh giá (1-5)',
    example: 5,
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Số sao phải từ 1-5' })
  @Max(5, { message: 'Số sao phải từ 1-5' })
  sao_binh_luan?: number;
}
