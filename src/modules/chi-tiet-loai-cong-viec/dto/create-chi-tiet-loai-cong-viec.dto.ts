import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChiTietLoaiCongViecDto {
  @ApiProperty({
    description: 'Tên chi tiết loại công việc',
    example: 'Lập trình web'
  })
  @IsString()
  ten_chi_tiet: string;

  @ApiPropertyOptional({
    description: 'Hình ảnh',
    example: 'https://example.com/image.jpg'
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID loại công việc',
    example: 1
  })
  @IsInt()
  ma_loai_cong_viec: number;
}
