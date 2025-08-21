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
  UseGuards,
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
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('loai-cong-viec')
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

  @Get('chi-tiet')
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

  @Get('chi-tiet/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục con',
    description: 'Lấy thông tin chi tiết về một danh mục con',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục con',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin danh mục con thành công',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục con không tồn tại',
  })
  async getSubCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getSubCategoryById(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục chính',
    description: 'Lấy thông tin chi tiết về một danh mục chính',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin danh mục chính thành công',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục chính không tồn tại',
  })
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Get(':id/chi-tiet')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh mục con theo danh mục chính',
    description: 'Lấy tất cả danh mục con của một danh mục chính',
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục con thành công',
  })
  async getSubCategoriesByMain(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getSubCategoriesByMain(id);
  }

  @Post()
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục chính mới',
    description: 'Tạo một danh mục công việc chính mới',
  })
  @ApiBearerAuth()
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
    description: 'Tạo danh mục chính thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo danh mục',
  })
  async createMainCategory(@Body() body: { ten_loai_cong_viec: string }) {
    return await this.categoriesService.createMainCategory(body.ten_loai_cong_viec);
  }

  @Post('chi-tiet')
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục con mới',
    description: 'Tạo một danh mục con mới',
  })
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ten_chi_tiet: {
          type: 'string',
          example: 'Thiết kế website',
        },
        ma_loai_cong_viec: {
          type: 'number',
          example: 1,
        },
        hinh_anh: {
          type: 'string',
          example: 'https://example.com/image.jpg',
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
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo danh mục',
  })
  async createSubCategory(
    @Body() body: {
      ten_chi_tiet: string;
      ma_loai_cong_viec: number;
      hinh_anh?: string;
    },
  ) {
    return await this.categoriesService.createSubCategory(body);
  }

  @Put(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục chính',
    description: 'Cập nhật thông tin một danh mục chính',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính',
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
    description: 'Cập nhật danh mục chính thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục chính không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật danh mục',
  })
  async updateMainCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { ten_loai_cong_viec: string },
  ) {
    return await this.categoriesService.updateMainCategory(id, body.ten_loai_cong_viec);
  }

  @Put('chi-tiet/:id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục con',
    description: 'Cập nhật thông tin một danh mục con',
  })
  @ApiBearerAuth()
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
          example: 'Thiết kế website',
        },
        ma_loai_cong_viec: {
          type: 'number',
          example: 1,
        },
        hinh_anh: {
          type: 'string',
          example: 'https://example.com/image.jpg',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật danh mục con thành công',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục con không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật danh mục',
  })
  async updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      ten_chi_tiet?: string;
      ma_loai_cong_viec?: number;
      hinh_anh?: string;
    },
  ) {
    return await this.categoriesService.updateSubCategory(id, body);
  }

  @Delete(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục chính',
    description: 'Xóa một danh mục chính',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Xóa danh mục chính thành công',
  })
  @ApiNotFoundResponse({
    description: 'Danh mục chính không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa danh mục',
  })
  async deleteMainCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteMainCategory(id);
  }

  @Delete('chi-tiet/:id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục con',
    description: 'Xóa một danh mục con',
  })
  @ApiBearerAuth()
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
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa danh mục',
  })
  async deleteSubCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.deleteSubCategory(id);
  }

  @Get('statistics/overview')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thống kê tổng quan danh mục',
    description: 'Lấy thống kê tổng quan về các danh mục',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  async getCategoryStatistics() {
    return await this.categoriesService.getStatistics();
  }
}
