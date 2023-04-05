import { PrismaCheckInRepository } from "@/repositories/prisma/prisma-check-in-repository";

import { GetUserMetricsUseCase } from "../get-user-metrics-usecase";

export function makeGetUserMetricsUseCase() {
    const checkInRepository = new PrismaCheckInRepository();

    return new GetUserMetricsUseCase(checkInRepository);
}
