import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

    findAll() {
        return `Hello World`;
    }
}