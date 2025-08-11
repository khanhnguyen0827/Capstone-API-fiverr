import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { PrismaService } from "../prisma/prisma.service";

// decorator: @
@Module({
   controllers: [ArticleController],
   providers: [ArticleService]
})
export class ArticleModule {}