import { IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateThueCongViecDto {
  @ApiProperty({
    description: 'ID công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @ApiProperty({
    description: 'ID người thuê',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_nguoi_thue?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoàn thành',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  hoan_thanh?: boolean;
}
