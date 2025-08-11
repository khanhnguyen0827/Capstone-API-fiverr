import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { User } from 'src/common/decorator/user.decorator';
import { Users } from 'generated/prisma';
import { QueryDto } from './dto/query.dto';

// localhost:3069/article/article
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @Query()
    query: QueryDto,
    @Param()
    params: any,
    @Headers()
    headers: any,
    @Body()
    body: any,
    @Req()
    req: Request,
    @User()
    user: Users,
  ) {
    // console.log({ query, params, headers, body, req });
    // console.log(req);
    console.log("---------- Controller => Service ---------- ");
    const data = await this.articleService.findAll(req, user);
    return data;
  }
}
