import { Prisma, User } from '@prisma/client';

export interface UserRepository {
    findOneByEmail(email: string): Promise<User | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
}