import { CheckIn } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-in-repository";
import { GymRepository } from "@/repositories/gym-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

interface CheckInUseCaseRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    constructor(
        private checkInRepository: CheckInRepository,
        private gymRepository: GymRepository,
    ) {}

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
    }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
        const gym = await this.gymRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const distance = getDistanceBetweenCoordinates(
            {
                latitude: userLatitude,
                longitude: userLongitude,
            },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            },
        );

        const MAX_DISTANCE_IN_KILOMETERS = 0.1;

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new Error();
        }

        const checkInOnSameDay =
            await this.checkInRepository.findByUserIdOnDate(userId, new Date());

        if (checkInOnSameDay) {
            throw new Error();
        }

        const checkIn = await this.checkInRepository.create({
            user_id: userId,
            gym_id: gymId,
        });

        return {
            checkIn,
        };
    }
}
