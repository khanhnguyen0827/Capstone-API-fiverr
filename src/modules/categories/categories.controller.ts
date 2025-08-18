import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, CreateSubCategoryDto, UpdateSubCategoryDto } from './dto/categories.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BaseController } from '../../common/base';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController extends BaseController {
  constructor(private readonly categoriesService: CategoriesService) {
    super();
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách tất cả danh mục công việc',
    description: 'Lấy danh sách các loại công việc chính và chi tiết'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh mục thành công',
        content: [
          {
            id: 1,
            ten_loai_cong_viec: 'Công nghệ thông tin',
            chiTietLoaiCongViec: [
              {
                id: 1,
                ten_chi_tiet: 'Lập trình web',
                hinh_anh: 'web-dev.jpg'
              }
            ]
          }
        ],
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories',
        method: 'GET'
      }
    }
  })
  async getAllCategories() {
    const categories = await this.categoriesService.getAllCategories();
    return this.createSuccessResponse(
      categories,
      'Lấy danh mục thành công'
    );
  }

  @Get('main')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách danh mục chính',
    description: 'Lấy danh sách các loại công việc chính'
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh mục chính thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh mục chính thành công',
        content: [
          {
            id: 1,
            ten_loai_cong_viec: 'Công nghệ thông tin'
          }
        ],
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/main',
        method: 'GET'
      }
    }
  })
  async getMainCategories() {
    const categories = await this.categoriesService.getMainCategories();
    return this.createSuccessResponse(
      categories,
      'Lấy danh mục chính thành công'
    );
  }

  @Get('main/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy chi tiết danh mục chính',
    description: 'Lấy thông tin chi tiết về một danh mục chính và các danh mục con'
  })
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết danh mục thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy chi tiết danh mục thành công',
        content: {
          id: 1,
          ten_loai_cong_viec: 'Công nghệ thông tin',
          chiTietLoaiCongViec: [
            {
              id: 1,
              ten_chi_tiet: 'Lập trình web',
              hinh_anh: 'web-dev.jpg'
            }
          ]
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/main/1',
        method: 'GET'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Danh mục không tồn tại'
  })
  async getMainCategoryById(@Param('id') id: number) {
    const category = await this.categoriesService.getMainCategoryById(id);
    return this.createSuccessResponse(
      category,
      'Lấy chi tiết danh mục thành công'
    );
  }

  @Post('main')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục chính mới',
    description: 'Tạo loại công việc chính mới (chỉ dành cho admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({
    description: 'Tạo danh mục chính thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo danh mục chính thành công',
        content: {
          id: 2,
          ten_loai_cong_viec: 'Thiết kế đồ họa'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/main',
        method: 'POST'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo danh mục'
  })
  async createMainCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.createMainCategory(createCategoryDto);
    return this.createCreatedResponse(
      category,
      'Tạo danh mục chính thành công'
    );
  }

  @Put('main/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục chính',
    description: 'Cập nhật thông tin danh mục chính (chỉ dành cho admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính cần cập nhật',
    type: Number,
    example: 1
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({
    description: 'Cập nhật danh mục chính thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật danh mục chính thành công',
        content: {
          id: 1,
          ten_loai_cong_viec: 'Công nghệ thông tin (Đã cập nhật)'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/main/1',
        method: 'PUT'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật danh mục'
  })
  @ApiNotFoundResponse({
    description: 'Danh mục không tồn tại'
  })
  async updateMainCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    const category = await this.categoriesService.updateMainCategory(id, updateCategoryDto);
    return this.createUpdatedResponse(
      category,
      'Cập nhật danh mục chính thành công'
    );
  }

  @Delete('main/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục chính',
    description: 'Xóa danh mục chính (chỉ dành cho admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID danh mục chính cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa danh mục chính thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa danh mục chính thành công',
        content: {
          message: 'Xóa danh mục chính thành công'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/main/1',
        method: 'DELETE'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa danh mục'
  })
  @ApiNotFoundResponse({
    description: 'Danh mục không tồn tại'
  })
  async deleteMainCategory(@Param('id') id: number) {
    await this.categoriesService.deleteMainCategory(id);
    return this.createDeletedResponse('Xóa danh mục chính thành công');
  }

  @Post('sub')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo danh mục con mới',
    description: 'Tạo chi tiết loại công việc mới (chỉ dành cho admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreateSubCategoryDto })
  @ApiCreatedResponse({
    description: 'Tạo danh mục con thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo danh mục con thành công',
        content: {
          id: 3,
          ten_chi_tiet: 'Thiết kế UI/UX',
          hinh_anh: 'ui-ux.jpg',
          ma_loai_cong_viec: 2
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/sub',
        method: 'POST'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo danh mục con'
  })
  async createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    const subCategory = await this.categoriesService.createSubCategory(createSubCategoryDto);
    return this.createCreatedResponse(
      subCategory,
      'Tạo danh mục con thành công'
    );
  }

  @Put('sub/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật danh mục con',
    description: 'Cập nhật thông tin danh mục con (chỉ dành cho admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID danh mục con cần cập nhật',
    type: Number,
    example: 1
  })
  @ApiBody({ type: UpdateSubCategoryDto })
  @ApiOkResponse({
    description: 'Cập nhật danh mục con thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật danh mục con thành công',
        content: {
          id: 1,
          ten_chi_tiet: 'Lập trình web (Đã cập nhật)',
          hinh_anh: 'web-dev-updated.jpg',
          ma_loai_cong_viec: 1
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/sub/1',
        method: 'PUT'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật danh mục con'
  })
  @ApiNotFoundResponse({
    description: 'Danh mục con không tồn tại'
  })
  async updateSubCategory(
    @Param('id') id: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto
  ) {
    const subCategory = await this.categoriesService.updateSubCategory(id, updateSubCategoryDto);
    return this.createUpdatedResponse(
      subCategory,
      'Cập nhật danh mục con thành công'
    );
  }

  @Delete('sub/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa danh mục con',
    description: 'Xóa danh mục con (chỉ dành cho admin)'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'id',
    description: 'ID danh mục con cần xóa',
    type: Number,
    example: 1
  })
  @ApiOkResponse({
    description: 'Xóa danh mục con thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Xóa danh mục con thành công',
        content: {
          message: 'Xóa danh mục con thành công'
        },
        timestamp: '2024-01-20T10:30:00.000Z',
        path: '/api/v1/categories/sub/1',
        method: 'DELETE'
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ'
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa danh mục con'
  })
  @ApiNotFoundResponse({
    description: 'Danh mục con không tồn tại'
  })
  async deleteSubCategory(@Param('id') id: number) {
    await this.categoriesService.deleteSubCategory(id);
    return this.createDeletedResponse('Xóa danh mục con thành công');
  }
}
