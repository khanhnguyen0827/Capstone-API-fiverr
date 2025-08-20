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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

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
    return await this.categoriesService.getMainCategories();
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
    return await this.categoriesService.getSubCategories();
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
  @ApiNotFoundResponse({
    description: 'Danh mục không tồn tại',
  })
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục chính mới',
    description: 'Tạo một danh mục công việc chính mới',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ten_loai_cong_viec: {
          type: 'string',
          example: 'Công nghệ thông tin',
        },
      },
      required: ['ten_loai_cong_viec'],
    },
  })
  @ApiCreatedResponse({
    description: 'Tạo danh mục thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async createMainCategory(@Body() body: { ten_loai_cong_viec: string }) {
    return await this.categoriesService.createMainCategory(body.ten_loai_cong_viec);
  }

  @Post('sub')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục con mới',
    description: 'Tạo một danh mục con mới',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ten_chi_tiet: {
          type: 'string',
          example: 'Lập trình web',
        },
        hinh_anh: {
          type: 'string',
          example: 'web-dev.jpg',
        },
        ma_loai_cong_viec: {
          type: 'number',
          example: 1,
        },
      },
      required: ['ten_chi_tiet', 'ma_loai_cong_viec'],
    },
  })
  @ApiCreatedResponse({
    description: 'Tạo danh mục con thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async createSubCategory(
    @Body() body: {
      ten_chi_tiet: string;
      hinh_anh?: string;
      ma_loai_cong_viec: number;
    },
  ) {
    return await this.categoriesService.createSubCategory(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục chính',
    description: 'Cập nhật thông tin danh mục chính',
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
          example: 'Công nghệ thông tin',
        },
      },
      required: ['ten_loai_cong_viec'],
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật danh mục thành công',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục không tồn tại',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async updateMainCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { ten_loai_cong_viec: string },
  ) {
    return await this.categoriesService.updateMainCategory(id, body.ten_loai_cong_viec);
  }

  @Put('sub/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục con',
    description: 'Cập nhật thông tin danh mục con',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục con',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ten_chi_tiet: {
          type: 'string',
          example: 'Lập trình web',
        },
        hinh_anh: {
          type: 'string',
          example: 'web-dev.jpg',
        },
        ma_loai_cong_viec: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật danh mục con thành công',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục con không tồn tại',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      ten_chi_tiet?: string;
      hinh_anh?: string;
      ma_loai_cong_viec?: number;
    },
  ) {
    return await this.categoriesService.updateSubCategory(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục chính',
    description: 'Xóa một danh mục chính',
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
  @ApiNotFoundResponse({
    description: 'Danh mục không tồn tại',
  })
  async deleteMainCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteMainCategory(id);
  }

  @Delete('sub/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục con',
    description: 'Xóa một danh mục con',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục con',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Xóa danh mục con thành công',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục con không tồn tại',
  })
  async deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteSubCategory(id);
  }
}
