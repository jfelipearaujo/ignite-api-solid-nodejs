import { PrismaUsersRepository } from '@/repositories/prisma-users-repository';
import { hash } from 'bcryptjs';

interface RegisterUser {
    name: string;
    email: string;
    password: string;
}

export async function registerUserUseCase ({ name, email, password }: RegisterUser) {
    const usersRepository = new PrismaUsersRepository();

    const userWithSameEmail = await usersRepository.findOneByEmail(email);

    if(userWithSameEmail) {
        throw new Error('Email already exists');
    }

    const password_hash = await hash(password, 6);


    await usersRepository.create({ 
        name,
        email,
        password_hash
    });
}