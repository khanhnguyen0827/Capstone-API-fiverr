import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller("auth")

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("list")
    findAll() {
        const data = this.authService.findAll();
        return {
            message: data,
        };
    }
  
}