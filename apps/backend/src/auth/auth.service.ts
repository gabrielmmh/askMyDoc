import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService, 
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user || !user.password) throw new UnauthorizedException();

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException();

        return user;
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign({ sub: user.id, email: user.email }),
        };
    }

    async register(data: { email: string; password: string; name: string }) {
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await this.userService.create({
            ...data,
            password: hashed,
            provider: 'local',
        });
        return this.login(user);
    }

    async generateJwtToken(user: any) {
        const payload = { sub: user.id, email: user.email };
        return this.jwtService.signAsync(payload);
    }
      
}
