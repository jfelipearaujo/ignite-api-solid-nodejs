import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

import { RegisterGymUseCase } from "../register-gym-usecase";

export function makeRegisterGymUseCase() {
    const gymRepository = new PrismaGymRepository();

    return new RegisterGymUseCase(gymRepository);
}
