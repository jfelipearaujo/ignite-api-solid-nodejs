import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

import { CheckInUseCase } from "../check-in-usecase";

export function makeCkeckInUseCase() {
    const checkInRepository = new PrismaCheckInRepository();
    const gymRepository = new PrismaGymRepository();

    return new CheckInUseCase(checkInRepository, gymRepository);
}
