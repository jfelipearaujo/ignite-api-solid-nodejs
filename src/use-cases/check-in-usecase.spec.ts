import { randomUUID } from "node:crypto";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-in-repository";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";

import { CheckInUseCase } from "./check-in-usecase";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInUseCase;

const gymId = "gym-id-1";

beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(checkInRepository, gymRepository);

    await gymRepository.create({
        id: gymId,
        title: "Gym Title",
        description: "Gym Description",
        phone: "99 9 9999-9999",
        latitude: -22.8871799,
        longitude: -46.9474326,
    });

    vi.useFakeTimers();
});

afterEach(() => {
    vi.useRealTimers();
});

describe("CheckInUseCase", () => {
    it("should be able to check in", async () => {
        // Act
        const date = new Date(2022, 0, 20, 8, 0, 0);
        vi.setSystemTime(date);

        const { checkIn } = await sut.execute({
            userId: randomUUID(),
            gymId,
            userLatitude: -22.8871799,
            userLongitude: -46.9474326,
        });

        // Assert
        expect(checkIn.id).toEqual(expect.any(String));
        expect(checkIn.created_at).toEqual(date);
    });

    it("should not be able to check in twice a day", async () => {
        // Arrange
        const date = new Date(2022, 0, 20, 8, 0, 0);
        vi.setSystemTime(date);

        const userId = randomUUID();

        await sut.execute({
            userId,
            gymId,
            userLatitude: -22.8871799,
            userLongitude: -46.9474326,
        });

        // Act + Assert
        await expect(() =>
            sut.execute({
                userId,
                gymId,
                userLatitude: -22.8871799,
                userLongitude: -46.9474326,
            }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
    });

    it("should be able to check in twice in different days", async () => {
        // Arrange
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        const userId = randomUUID();

        await sut.execute({
            userId,
            gymId,
            userLatitude: -22.8871799,
            userLongitude: -46.9474326,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        // Act
        const { checkIn } = await sut.execute({
            userId,
            gymId,
            userLatitude: -22.8871799,
            userLongitude: -46.9474326,
        });

        // Assert
        expect(checkIn.id).toEqual(expect.any(String));
    });

    it("should not be able to check in at a gym that its far away", async () => {
        // Act
        await gymRepository.create({
            id: "gym-id-2",
            title: "Gym Title",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -22.7682444,
            longitude: -47.1599113,
        });

        const date = new Date(2022, 0, 20, 8, 0, 0);
        vi.setSystemTime(date);

        // Act + Assert
        await expect(() =>
            sut.execute({
                userId: randomUUID(),
                gymId,
                userLatitude: -22.8829504,
                userLongitude: -46.9969626,
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError);
    });
});
