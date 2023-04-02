import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../users-repository';
import { randomUUID } from 'crypto';

export class InMemoryUserRepository implements UserRepository {
    public items: User[] = [];

    async findById(id: string): Promise<User | null> {
        const user = this.items.find(user => user.id === id);

        if(user) {
            return user;
        }

        return null;
    }

    async findByEmail(email: string) {
        const user = this.items.find(user => user.email === email);

        if(user) {
            return user;
        }

        return null;
    }

    async create(data: Prisma.UserCreateInput) {
        const user = {
            id: randomUUID(),
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            create_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(user);

        return user;
    }
}