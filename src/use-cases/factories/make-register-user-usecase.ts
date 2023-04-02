import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';
import { RegisterUserUseCase } from '../register-user-usecase';

export function makeRegisterUserUseCase() {
    const usersRepository = new PrismaUserRepository();
    const registerUserUseCase = new RegisterUserUseCase(usersRepository);

    return registerUserUseCase;
}