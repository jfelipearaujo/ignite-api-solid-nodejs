import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";

import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms-usecase";

let gymRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsUseCase;

beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    sut = new FetchNearbyGymsUseCase(gymRepository);
});

describe("FetchNearbyGymsUseCase", () => {
    it("should be able to fetch nearby gyms", async () => {
        // Arrange
        await gymRepository.create({
            title: "Near Gym 1",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -22.8871799,
            longitude: -46.9474326,
        });

        await gymRepository.create({
            title: "Far Gym 2",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -23.0078895,
            longitude: -46.7056322,
        });

        await gymRepository.create({
            title: "Far Gym 3",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -23.088236,
            longitude: -46.5284074,
        });

        // Act
        const { gyms } = await sut.execute({
            userLatitude: -22.8875799,
            userLongitude: -46.9478326,
        });

        // Assert
        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Near Gym 1" }),
        ]);
    });
});
