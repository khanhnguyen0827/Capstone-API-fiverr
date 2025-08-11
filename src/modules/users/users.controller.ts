import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('page') page: string = '1', @Query('size') size: string = '10') {
    const result = await this.usersService.getUsers(parseInt(page), parseInt(size));
    return {
      statusCode: 200,
      message: 'Lấy danh sách người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const result = await this.usersService.getUserById(parseInt(id));
    return {
      statusCode: 200,
      message: 'Lấy thông tin người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.createUser(createUserDto);
    return {
      statusCode: 201,
      message: 'Tạo người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const result = await this.usersService.updateUser(parseInt(id), updateUserDto, req.user);
    return {
      statusCode: 200,
      message: 'Cập nhật người dùng thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    await this.usersService.deleteUser(parseInt(id), req.user);
    return {
      statusCode: 200,
      message: 'Xóa người dùng thành công',
      content: null,
      dateTime: new Date().toISOString(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getProfile(@Request() req) {
    const result = await this.usersService.getUserById(req.user.userId);
    return {
      statusCode: 200,
      message: 'Lấy thông tin profile thành công',
      content: result,
      dateTime: new Date().toISOString(),
    };
  }
}
