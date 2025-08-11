import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadLocal } from 'src/common/multer/local.multer';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'generated/prisma';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('avatar-local')
  @UseInterceptors(FileInterceptor('avatar', uploadLocal))
  avatarLocal(@UploadedFile() file: Express.Multer.File, @User() user: Users) {
    return this.userService.avatarLocal(file, user);
  }

  @Post('avatar-cloud')
  @UseInterceptors(FileInterceptor('avatar'))
  avatarCloud(@UploadedFile() file: Express.Multer.File, @User() user: Users) {
    return this.userService.avatarCloud(file, user);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
