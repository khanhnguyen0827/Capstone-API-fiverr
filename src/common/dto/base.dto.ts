import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Trang hiện tại',
    example: 1,
    default: 1,
    minimum: 1,
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
    minimum: 1,
    maximum: 100,
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
    default: 'desc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Bộ lọc theo trạng thái',
    example: 'active',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Bộ lọc theo ngày tạo từ',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Bộ lọc theo ngày tạo đến',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

export class BaseResponseDto<T = any> {
  @ApiProperty({
    description: 'Thông báo',
    example: 'Thao tác thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Dữ liệu trả về',
  })
  data?: T;

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

  @ApiPropertyOptional({
    description: 'Thời gian xử lý (ms)',
    example: 150,
  })
  processingTime?: number;

  @ApiProperty({
    description: 'Trạng thái response',
    example: 'success',
  })
  status: 'success' | 'error' = 'success';
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Thông báo lỗi',
    example: 'Có lỗi xảy ra',
  })
  message: string;

  @ApiProperty({
    description: 'Mã lỗi',
    example: 'VALIDATION_ERROR',
  })
  error: string;

  @ApiProperty({
    description: 'Trạng thái HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiPropertyOptional({
    description: 'Chi tiết lỗi',
  })
  details?: any;

  @ApiProperty({
    description: 'Thời gian xảy ra lỗi',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;
}

export class BaseEntityDto {
  @ApiProperty({
    description: 'ID của entity',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Trạng thái xóa',
    example: false,
  })
  is_deleted: boolean;

  @ApiPropertyOptional({
    description: 'ID người xóa',
    example: 1,
  })
  deleted_by?: number;

  @ApiPropertyOptional({
    description: 'Thời gian xóa',
    example: '2024-01-01T00:00:00.000Z',
  })
  deleted_at?: Date;

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}

export class FilterDto {
  @ApiPropertyOptional({
    description: 'Bộ lọc theo trường',
    example: { name: 'John', role: 'user' },
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value;
  })
  filters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Chỉ lấy các trường cụ thể',
    example: 'id,name,email',
  })
  @IsOptional()
  @IsString()
  select?: string;

  @ApiPropertyOptional({
    description: 'Bỏ qua các trường cụ thể',
    example: 'password,deleted_at',
  })
  @IsOptional()
  @IsString()
  exclude?: string;
}
