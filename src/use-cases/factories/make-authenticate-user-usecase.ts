import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";

import { AuthenticateUserUseCase } from "../authenticate-user-usecase";

export function makeAuthenticateUserUseCase() {
    const usersRepository = new PrismaUserRepository();
    const authenticateUseCase = new AuthenticateUserUseCase(usersRepository);

    return authenticateUseCase;
}
