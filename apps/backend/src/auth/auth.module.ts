import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: 'jwt-secret', // coloque em variável de ambiente depois
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
