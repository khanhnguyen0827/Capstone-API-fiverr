import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description: 'Lấy danh sách tất cả người dùng với phân trang và tìm kiếm',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm (tên, email, skill)',
    type: String,
    example: 'developer',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Lọc theo vai trò',
    type: String,
    example: 'freelancer',
  })
  @ApiQuery({
    name: 'skill',
    required: false,
    description: 'Lọc theo kỹ năng',
    type: String,
    example: 'React',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
    type: UserResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('skill') skill?: string,
  ) {
    const result = await this.usersService.findAll(
      page || 1,
      size || 10,
      search,
      role,
      skill,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      ...result,
    };
  }

  @Get('profile')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin profile người dùng',
    description: 'Lấy thông tin profile của người dùng đang đăng nhập',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lấy profile thành công',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getProfile(@Request() req: any) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const profile = await this.usersService.getProfile(userId);
    return {
      statusCode: 200,
      message: 'Lấy profile thành công',
      data: profile,
    };
  }

  @Get('freelancers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách freelancer',
    description: 'Lấy danh sách tất cả freelancer với phân trang',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'skill',
    required: false,
    description: 'Lọc theo kỹ năng',
    type: String,
    example: 'React',
  })
  @ApiQuery({
    name: 'rating',
    required: false,
    description: 'Đánh giá tối thiểu',
    type: Number,
    example: 4,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách freelancer thành công',
    type: UserResponseDto,
    isArray: true,
  })
  async getFreelancers(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
    @Query('skill') skill?: string,
    @Query('rating', new ParseIntPipe({ optional: true })) rating?: number,
  ) {
    const result = await this.usersService.getFreelancers(
      page || 1,
      size || 10,
      skill,
      rating,
    );
    return {
      statusCode: 200,
      message: 'Lấy danh sách freelancer thành công',
      ...result,
    };
  }

  @Get('top-rated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách người dùng đánh giá cao',
    description: 'Lấy danh sách người dùng có đánh giá cao nhất',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng người dùng (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng đánh giá cao thành công',
    type: UserResponseDto,
    isArray: true,
  })
  async getTopRatedUsers(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const users = await this.usersService.getTopRatedUsers(limit || 10);
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng đánh giá cao thành công',
      data: users,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin người dùng theo ID',
    description: 'Lấy thông tin chi tiết về một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    return {
      statusCode: 200,
      message: 'Lấy thông tin người dùng thành công',
      data: user,
    };
  }

  @Get(':id/jobs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy công việc của người dùng',
    description: 'Lấy danh sách công việc được tạo bởi một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy công việc của người dùng thành công',
  })
  async getUserJobs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.usersService.getUserJobs(id, page || 1, size || 10);
    return {
      statusCode: 200,
      message: 'Lấy công việc của người dùng thành công',
      ...result,
    };
  }

  @Get(':id/reviews')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy đánh giá của người dùng',
    description: 'Lấy danh sách đánh giá và bình luận về một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang (mặc định: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    description: 'Số lượng item mỗi trang (mặc định: 10)',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy đánh giá của người dùng thành công',
  })
  async getUserReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.usersService.getUserReviews(id, page || 1, size || 10);
    return {
      statusCode: 200,
      message: 'Lấy đánh giá của người dùng thành công',
      ...result,
    };
  }

  @Post()
  @UseGuards()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo một người dùng mới (chỉ admin)',
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Tạo người dùng thành công',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền tạo người dùng',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: 201,
      message: 'Tạo người dùng thành công',
      data: user,
    };
  }

  @Put(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của một người dùng',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Cập nhật thông tin thành công',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật người dùng này',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    const userId = req.user?.userId || 1; // Fallback cho demo
    const user = await this.usersService.update(id, updateUserDto, userId);
    return {
      statusCode: 200,
      message: 'Cập nhật thông tin thành công',
      data: user,
    };
  }

  @Delete(':id')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa một người dùng (chỉ admin)',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Xóa người dùng thành công',
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền xóa người dùng',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {
      statusCode: 200,
      message: 'Xóa người dùng thành công',
    };
  }

  @Put(':id/role')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật vai trò người dùng',
    description: 'Cập nhật vai trò của một người dùng (chỉ admin)',
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          description: 'Vai trò mới (user, admin, freelancer, client)',
          example: 'freelancer',
        },
      },
      required: ['role'],
    },
  })
  @ApiOkResponse({
    description: 'Cập nhật vai trò thành công',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền cập nhật vai trò',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { role: string },
  ) {
    const user = await this.usersService.updateRole(id, body.role);
    return {
      statusCode: 200,
      message: 'Cập nhật vai trò thành công',
      data: user,
    };
  }

  @Get('statistics/overview')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Thống kê tổng quan người dùng',
    description: 'Lấy thống kê tổng quan về người dùng',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập',
  })
  async getUserStatistics() {
    const stats = await this.usersService.getStatistics();
    return {
      statusCode: 200,
      message: 'Lấy thống kê thành công',
      data: stats,
    };
  }
}
