import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên loại công việc chính',
    example: 'Công nghệ thông tin',
    type: String
  })
  @IsString()
  ten_loai_cong_viec: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Tên loại công việc chính',
    example: 'Công nghệ thông tin (Đã cập nhật)',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  ten_loai_cong_viec?: string;
}

export class CreateSubCategoryDto {
  @ApiProperty({
    description: 'Tên chi tiết loại công việc',
    example: 'Lập trình web',
    type: String
  })
  @IsString()
  ten_chi_tiet: string;

  @ApiProperty({
    description: 'Hình ảnh đại diện',
    example: 'web-dev.jpg',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID loại công việc chính',
    example: 1,
    type: Number
  })
  @IsNumber()
  ma_loai_cong_viec: number;
}

export class UpdateSubCategoryDto {
  @ApiProperty({
    description: 'Tên chi tiết loại công việc',
    example: 'Lập trình web (Đã cập nhật)',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  ten_chi_tiet?: string;

  @ApiProperty({
    description: 'Hình ảnh đại diện',
    example: 'web-dev-updated.jpg',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID loại công việc chính',
    example: 1,
    type: Number,
    required: false
  })
  @IsOptional()
  @IsNumber()
  ma_loai_cong_viec?: number;
}

export class CategoryResponseDto {
  @ApiProperty({
    description: 'ID loại công việc chính',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Tên loại công việc chính',
    example: 'Công nghệ thông tin'
  })
  ten_loai_cong_viec: string;

  @ApiProperty({
    description: 'Danh sách chi tiết loại công việc',
    type: 'array'
  })
  chiTietLoaiCongViec?: any[];
}

export class SubCategoryResponseDto {
  @ApiProperty({
    description: 'ID chi tiết loại công việc',
    example: 1
  })
  id: number;

  @ApiProperty({
    description: 'Tên chi tiết loại công việc',
    example: 'Lập trình web'
  })
  ten_chi_tiet: string;

  @ApiProperty({
    description: 'Hình ảnh đại diện',
    example: 'web-dev.jpg'
  })
  hinh_anh?: string;

  @ApiProperty({
    description: 'ID loại công việc chính',
    example: 1
  })
  ma_loai_cong_viec: number;

  @ApiProperty({
    description: 'Thông tin loại công việc chính',
    type: 'object'
  })
  loaiCongViec?: any;
}
