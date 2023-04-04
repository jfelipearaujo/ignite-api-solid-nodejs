import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history-usecase";

let checkInRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInsHistoryUseCase;

beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInsHistoryUseCase(checkInRepository);
});

describe("FetchUserCheckInsHistoryUseCase", () => {
    it("should be able to fetch user's history", async () => {
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
        const { checkIns } = await sut.execute({
            userId,
            page: 1,
        });

        // Assert
        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-id-1" }),
            expect.objectContaining({ gym_id: "gym-id-2" }),
        ]);
    });

    it("should be able to fetch paginated user's history", async () => {
        // Arrange
        const userId = "user-id-1";

        for (let i = 1; i <= 22; i++) {
            await checkInRepository.create({
                user_id: userId,
                gym_id: `gym-id-${i}`,
            });
        }

        // Act
        const { checkIns } = await sut.execute({
            userId,
            page: 2,
        });

        // Assert
        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: "gym-id-21" }),
            expect.objectContaining({ gym_id: "gym-id-22" }),
        ]);
    });
});
