import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    create(data: { name: string; email: string; password: string; provider: string }) {
        return this.prisma.user.create({ data });
    }
}
