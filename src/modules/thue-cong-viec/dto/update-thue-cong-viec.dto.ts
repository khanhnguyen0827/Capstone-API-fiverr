import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, IsBoolean } from 'class-validator';
import { CreateThueCongViecDto } from './create-thue-cong-viec.dto';

export class UpdateThueCongViecDto extends PartialType(CreateThueCongViecDto) {
  @ApiPropertyOptional({
    description: 'ID công việc',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_cong_viec?: number;

  @ApiPropertyOptional({
    description: 'ID người thuê',
    example: 1
  })
  @IsOptional()
  @IsInt()
  ma_nguoi_thue?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoàn thành',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  hoan_thanh?: boolean;
}
