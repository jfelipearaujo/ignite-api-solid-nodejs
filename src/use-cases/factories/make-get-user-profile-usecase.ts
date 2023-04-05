import { PrismaUserRepository } from "@/repositories/prisma/prisma-users-repository";

import { GetUserProfileUseCase } from "../get-user-profile-usecase";

export function makeGetUserProfileUseCase() {
    const userRepository = new PrismaUserRepository();

    return new GetUserProfileUseCase(userRepository);
}
