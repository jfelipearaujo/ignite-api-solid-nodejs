import { CheckIn } from "@prisma/client";
import { CheckInRepository } from "@/repositories/check-in-repository";

interface FetchUserCheckInsHistoryRequest {
    userId: string;
    page: number;
}

interface FetchUserCheckInsHistoryResponse {
    checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(private checkInRepository: CheckInRepository) {}

    async execute({
        userId,
        page,
    }: FetchUserCheckInsHistoryRequest): Promise<FetchUserCheckInsHistoryResponse> {
        const checkIns = await this.checkInRepository.findManyByUserId(
            userId,
            page,
        );

        return {
            checkIns,
        };
    }
}
