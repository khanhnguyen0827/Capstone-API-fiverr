import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'ID công việc',
    example: 1,
  })
  @IsInt()
  ma_cong_viec: number;

  @ApiProperty({
    description: 'ID người bình luận',
    example: 1,
  })
  @IsInt()
  ma_nguoi_binh_luan: number;

  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Công việc rất tốt, tôi rất hài lòng!',
  })
  @IsString()
  noi_dung: string;

  @ApiProperty({
    description: 'Số sao đánh giá (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  sao_binh_luan: number;
}

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Công việc rất tốt, tôi rất hài lòng! (Đã cập nhật)',
    required: false,
  })
  @IsOptional()
  @IsString()
  noi_dung?: string;

  @ApiProperty({
    description: 'Số sao đánh giá (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  sao_binh_luan?: number;
}

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  ma_cong_viec?: number | null;

  @ApiProperty({ example: 1 })
  ma_nguoi_binh_luan?: number | null;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  ngay_binh_luan: Date;

  @ApiProperty({ example: 'Công việc rất tốt, tôi rất hài lòng!' })
  noi_dung: string;

  @ApiProperty({ example: 5 })
  sao_binh_luan?: number | null;
}
