import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });
    }    

    create(data: { name: string; email: string; password: string; provider: string }) {
        return this.prisma.user.create({ data });
    }

    findOrCreate(data: { email: string; name: string; provider: string }) {
        return this.prisma.user.findUnique({ where: { email: data.email } })
            .then(user => {
                if (user) return user;
                return this.prisma.user.create({ data });
            });
    }    
}
