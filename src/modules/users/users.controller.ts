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
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/users.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy danh sách người dùng',
    description: 'Lấy danh sách tất cả người dùng với phân trang',
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
    description: 'Lấy danh sách người dùng thành công',
    type: UserResponseDto,
    isArray: true,
  })
  async getUsers(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ) {
    const result = await this.usersService.findAll(page || 1, size || 10);
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      ...result,
    };
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lấy thông tin profile người dùng',
    description: 'Lấy thông tin profile của người dùng đang đăng nhập',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy profile thành công',
    type: UserResponseDto,
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Tạo người dùng mới',
    description: 'Tạo một người dùng mới',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Tạo người dùng thành công',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của một người dùng',
  })
  @ApiParam({
    name: 'id',
    description: 'ID người dùng',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Cập nhật người dùng thành công',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Người dùng không tồn tại',
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
  })
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      statusCode: 200,
      message: 'Cập nhật người dùng thành công',
      data: user,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Xóa người dùng',
    description: 'Xóa một người dùng',
  })
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
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.remove(id);
    return {
      statusCode: 200,
      message: 'Xóa người dùng thành công',
      data: { id },
    };
  }
}
