import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
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
        profile: any,
        done: (error: any, user?: any) => void,
    ): Promise<any> {
        const { name, emails } = profile;
        const user = {
            email: emails[0].value,
            name: name.givenName,
            provider: 'google',
        };
        done(null, user);
    }
}
