import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục chính',
    description: 'Lấy tất cả danh mục công việc chính',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục thành công',
  })
  async getMainCategories() {
    return {
      statusCode: 200,
      message: 'Lấy danh mục thành công',
      data: [
        { id: 1, ten_loai_cong_viec: 'Công nghệ thông tin' },
        { id: 2, ten_loai_cong_viec: 'Thiết kế đồ họa' },
      ],
    };
  }

  @Get('sub')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục con',
    description: 'Lấy tất cả danh mục con với thông tin danh mục chính',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục con thành công',
  })
  async getSubCategories() {
    return {
      statusCode: 200,
      message: 'Lấy danh mục con thành công',
      data: [
        {
          id: 1,
          ten_chi_tiet: 'Lập trình web',
          hinh_anh: 'web-dev.jpg',
          ma_loai_cong_viec: 1,
          loaiCongViec: {
            id: 1,
            ten_loai_cong_viec: 'Công nghệ thông tin',
          },
        },
      ],
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục',
    description: 'Lấy thông tin chi tiết về một danh mục',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin danh mục thành công',
  })
  async getCategoryById(@Param('id') id: number) {
    return {
      statusCode: 200,
      message: 'Lấy thông tin danh mục thành công',
      data: { id, ten_loai_cong_viec: 'Công nghệ thông tin' },
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục mới',
    description: 'Tạo một danh mục công việc mới',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ten_loai_cong_viec: { type: 'string', example: 'Marketing' },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Tạo danh mục thành công',
  })
  async createCategory(@Body() createCategoryDto: any) {
    return {
      statusCode: 201,
      message: 'Tạo danh mục thành công',
      data: createCategoryDto,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục',
    description: 'Cập nhật thông tin danh mục',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ten_loai_cong_viec: {
          type: 'string',
          example: 'Marketing (Đã cập nhật)',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật danh mục thành công',
  })
  async updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: any,
  ) {
    return {
      statusCode: 200,
      message: 'Cập nhật danh mục thành công',
      data: { id, ...updateCategoryDto },
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục',
    description: 'Xóa một danh mục',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Xóa danh mục thành công',
  })
  async deleteCategory(@Param('id') id: number) {
    return {
      statusCode: 200,
      message: 'Xóa danh mục thành công',
      data: { id },
    };
  }
}
