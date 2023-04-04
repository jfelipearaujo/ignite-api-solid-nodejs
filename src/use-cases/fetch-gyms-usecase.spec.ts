import { expect, describe, it, beforeEach } from "vitest";
import { FetchGymsUseCase } from "./fetch-gyms-usecase";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";

let gymRepository: InMemoryGymRepository;
let sut: FetchGymsUseCase;

beforeEach(async () => {
    gymRepository = new InMemoryGymRepository();
    sut = new FetchGymsUseCase(gymRepository);
});

describe("FetchGymsUseCase", () => {
    it("should be able to search gyms by title", async () => {
        // Arrange
        await gymRepository.create({
            title: "Gym Title",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -22.8871799,
            longitude: -46.9474326,
        });

        await gymRepository.create({
            title: "Another Gyn Title",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -22.8871799,
            longitude: -46.9474326,
        });

        // Act
        const { gyms } = await sut.execute({
            query: "Gym",
            page: 1,
        });

        // Assert
        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([expect.objectContaining({ title: "Gym Title" })]);
    });

    it("should be able to search paginate gyms by title", async () => {
        // Arrange
        for (let i = 1; i <= 22; i++) {
            await gymRepository.create({
                title: `Gym Title ${i}`,
                description: "Gym Description",
                phone: "99 9 9999-9999",
                latitude: -22.8871799,
                longitude: -46.9474326,
            });
        }

        // Act
        const { gyms } = await sut.execute({
            query: "title",
            page: 2,
        });

        // Assert
        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: "Gym Title 21" }),
            expect.objectContaining({ title: "Gym Title 22" }),
        ]);
    });
});
