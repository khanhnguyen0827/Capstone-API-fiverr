import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Trang hiện tại',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng item trên mỗi trang',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Từ khóa tìm kiếm',
    example: 'javascript',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Sắp xếp theo trường',
    example: 'created_at',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BaseResponseDto {
  @ApiPropertyOptional({
    description: 'Thông báo',
    example: 'Thao tác thành công',
  })
  message?: string;

  @ApiPropertyOptional({
    description: 'Dữ liệu trả về',
  })
  data?: any;

  @ApiPropertyOptional({
    description: 'Tổng số item',
    example: 100,
  })
  total?: number;

  @ApiPropertyOptional({
    description: 'Trang hiện tại',
    example: 1,
  })
  page?: number;

  @ApiPropertyOptional({
    description: 'Số lượng item trên mỗi trang',
    example: 10,
  })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Tổng số trang',
    example: 10,
  })
  totalPages?: number;
}
