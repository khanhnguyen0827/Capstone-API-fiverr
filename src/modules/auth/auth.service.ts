import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(private readonly prisma:PrismaService) {}

    findAll() {
        const data = this.prisma.nguoiDung.findMany();  
        return data;
    }
}