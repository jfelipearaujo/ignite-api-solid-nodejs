import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { ValidateCheckInUseCase } from "../validate-check-in.usecase";

export function makeValidateCheckInUseCase() {
    const checkInRepository = new PrismaCheckInRepository();

    return new ValidateCheckInUseCase(checkInRepository);
}
