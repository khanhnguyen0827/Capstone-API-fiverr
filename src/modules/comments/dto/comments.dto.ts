import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RATING_CONFIG, VALIDATION_MESSAGES } from '../../../common/constant/app.constant';

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
    description: `Số sao đánh giá (${RATING_CONFIG.min}-${RATING_CONFIG.max})`,
    example: 5,
    type: Number,
    minimum: RATING_CONFIG.min,
    maximum: RATING_CONFIG.max,
  })
  @IsOptional()
  @IsNumber()
  @Min(RATING_CONFIG.min, { message: VALIDATION_MESSAGES.RATING_RANGE })
  @Max(RATING_CONFIG.max, { message: VALIDATION_MESSAGES.RATING_RANGE })
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
    description: `Số sao đánh giá (${RATING_CONFIG.min}-${RATING_CONFIG.max})`,
    example: 5,
    type: Number,
    minimum: RATING_CONFIG.min,
    maximum: RATING_CONFIG.max,
  })
  @IsOptional()
  @IsNumber()
  @Min(RATING_CONFIG.min, { message: VALIDATION_MESSAGES.RATING_RANGE })
  @Max(RATING_CONFIG.max, { message: VALIDATION_MESSAGES.RATING_RANGE })
  sao_binh_luan?: number;
}
