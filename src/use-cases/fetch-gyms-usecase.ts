import { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";

interface FetchGymsUseCaseRequest {
    query: string;
    page: number;
}

interface FetchGymsUseCaseResponse {
    gyms: Gym[];
}

export class FetchGymsUseCase {
    constructor(private gymRepository: GymRepository) {}

    async execute({
        query,
        page,
    }: FetchGymsUseCaseRequest): Promise<FetchGymsUseCaseResponse> {
        const gyms = await this.gymRepository.fetchMany(query, page);

        return {
            gyms,
        };
    }
}
