import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics-usecase";

let checkInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(checkInRepository);
});

describe("GetUserMetricsUseCase", () => {
    it("should be able to get check-ins count from user's metrics", async () => {
        // Arrange
        const userId = "user-id-1";

        await checkInRepository.create({
            user_id: userId,
            gym_id: "gym-id-1",
        });
        await checkInRepository.create({
            user_id: userId,
            gym_id: "gym-id-2",
        });

        // Act
        const { checkInsCount } = await sut.execute({
            userId,
        });

        // Assert
        expect(checkInsCount).toEqual(2);
    });
});
