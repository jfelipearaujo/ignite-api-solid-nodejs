import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

import { FetchGymsUseCase } from "../fetch-gyms-usecase";

export function makeFetchGymsUseCase() {
    const gymRepository = new PrismaGymRepository();

    return new FetchGymsUseCase(gymRepository);
}
