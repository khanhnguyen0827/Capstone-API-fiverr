import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLoaiCongViecDto {
  @ApiProperty({
    description: 'Tên loại công việc',
    example: 'Công nghệ thông tin'
  })
  @IsString()
  ten_loai_cong_viec: string;
}
