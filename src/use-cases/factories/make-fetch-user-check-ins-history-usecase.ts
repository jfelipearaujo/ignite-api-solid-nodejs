import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "../fetch-user-check-ins-history-usecase";

export function makeFetchUserCheckInsHistoryUseCase() {
    const checkInRepository = new PrismaCheckInRepository();

    return new FetchUserCheckInsHistoryUseCase(checkInRepository);
}
