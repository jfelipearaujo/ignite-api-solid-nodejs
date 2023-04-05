import { PrismaGymRepository } from "@/repositories/prisma/prisma-gym-repository";

import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms-usecase";

export function makeFetchNearbyGymsUseCase() {
    const gymRepository = new PrismaGymRepository();

    return new FetchNearbyGymsUseCase(gymRepository);
}
