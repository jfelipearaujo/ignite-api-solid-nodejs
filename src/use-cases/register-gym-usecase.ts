import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { Gym } from "@prisma/client";
import { GymRepository } from "@/repositories/gym-repository";

interface RegisterGymUseCaseRequest {
    title: string;
    description: string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface RegisterGymUseCaseResponse {
    gym: Gym;
}

export class RegisterGymUseCase {
    constructor(private gymRepository: GymRepository) {}

    async execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    }: RegisterGymUseCaseRequest): Promise<RegisterGymUseCaseResponse> {
        const gym = await this.gymRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        });

        if (gym) {
            throw new UserAlreadyExistsError();
        }

        return {
            gym,
        };
    }
}
