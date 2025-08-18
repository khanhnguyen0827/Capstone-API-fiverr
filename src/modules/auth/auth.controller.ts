import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Get("list")
    async findAll(@Query() query: any) {
        return await this.authService.findAll(query);
    }
}