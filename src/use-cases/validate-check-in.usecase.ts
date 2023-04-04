import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface ValidateCheckInRequest {
    checkInId: string;
}

interface ValidateCheckInResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
    constructor(private checkInRepository: CheckInRepository) {}

    async execute({
        checkInId,
    }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
        let checkIn = await this.checkInRepository.findById(checkInId);

        if (!checkIn) {
            throw new ResourceNotFoundError();
        }

        checkIn.validate_at = new Date();

        checkIn = await this.checkInRepository.save(checkIn);

        return {
            checkIn,
        };
    }
}
