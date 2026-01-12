import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface GoogleProfile {
    name: { givenName: string; familyName?: string };
    emails?: Array<{ value: string; verified?: boolean }>;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private userService: UserService,
        private authService: AuthService,
    ) {
        const options: StrategyOptions = {
            clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL')!,
            scope: ['email', 'profile'],
        };
        super(options);
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: GoogleProfile,
        done: (error: Error | null, user?: { id: string; email: string }) => void,
    ): Promise<void> {
        const { name, emails } = profile;

        if (!emails || emails.length === 0) {
            throw new UnauthorizedException('Conta Google deve ter um email associado');
        }

        const email = emails[0].value;

        const user = await this.userService.findOrCreate({
            email,
            name: name.givenName,
            provider: 'google',
        });

        done(null, {
            id: user.id,
            email: user.email,
        });
    }    
}
