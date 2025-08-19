import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateLoaiCongViecDto } from './create-loai-cong-viec.dto';

export class UpdateLoaiCongViecDto extends PartialType(CreateLoaiCongViecDto) {
  @ApiPropertyOptional({
    description: 'Tên loại công việc',
    example: 'Công nghệ thông tin'
  })
  @IsOptional()
  @IsString()
  ten_loai_cong_viec?: string;
}
