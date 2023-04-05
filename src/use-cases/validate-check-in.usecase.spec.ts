import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";

import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { ValidateCheckInUseCase } from "./validate-check-in.usecase";

let repository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

beforeEach(() => {
    repository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(repository);

    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("ValidateCheckInUseCase", () => {
    it("should be able to validate user's check-in", async () => {
        // Arrange
        const date = new Date(2023, 0, 3, 13, 0, 0);
        vi.setSystemTime(date);

        const checkInId = "check-in-id";

        await repository.create({
            id: checkInId,
            user_id: "user-id",
            gym_id: "gym-id",
        });

        // Act
        const { checkIn } = await sut.execute({
            checkInId,
        });

        // Assert
        expect(checkIn.validate_at).toEqual(date);
    });

    it("should not be able to validate a inexistent check-in", async () => {
        // Act + Assert
        await expect(() =>
            sut.execute({
                checkInId: "non-existent-check-in-id",
            }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });

    it("should not be able to validate user's check-in if exceed time limit", async () => {
        // Arrange
        vi.setSystemTime(new Date(2023, 0, 3, 13, 0, 0));

        const checkInId = "check-in-id";

        await repository.create({
            id: checkInId,
            user_id: "user-id",
            gym_id: "gym-id",
        });

        const thirtyMinutesInMilliseconds = 1 * 1000 * 60 * 30;

        vi.advanceTimersByTime(thirtyMinutesInMilliseconds);

        // Act + Assert
        await expect(() =>
            sut.execute({
                checkInId,
            }),
        ).rejects.toBeInstanceOf(LateCheckInValidationError);
    });
});
