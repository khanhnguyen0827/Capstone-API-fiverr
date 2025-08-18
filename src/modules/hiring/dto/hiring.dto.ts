import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateHiringDto {
  @ApiProperty({
    description: 'ID công việc cần thuê',
    example: 1,
    type: Number
  })
  @IsNumber()
  ma_cong_viec: number;
}

export class UpdateHiringDto {
  @ApiProperty({
    description: 'Trạng thái hoàn thành công việc',
    example: true,
    type: Boolean,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  hoan_thanh?: boolean;
}

export class HiringResponseDto {
  @ApiProperty({
    description: 'ID công việc được thuê',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'ID công việc',
    example: 1
  })
  ma_cong_viec: number;

  @ApiProperty({
    description: 'ID người thuê',
    example: 1
  })
  ma_nguoi_thue: number;

  @ApiProperty({
    description: 'Ngày thuê công việc',
    example: '2024-01-20T10:30:00.000Z'
  })
  ngay_thue: Date;

  @ApiProperty({
    description: 'Trạng thái hoàn thành',
    example: false
  })
  hoan_thanh: boolean;

  @ApiProperty({
    description: 'Thông tin công việc',
    type: 'object'
  })
  congViec?: any;

  @ApiProperty({
    description: 'Thông tin người thuê',
    type: 'object'
  })
  nguoiThue?: any;
}
