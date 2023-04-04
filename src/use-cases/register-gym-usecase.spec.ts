import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { RegisterGymUseCase } from "./register-gym-usecase";

let repository: InMemoryGymRepository;
let sut: RegisterGymUseCase;

beforeEach(() => {
    repository = new InMemoryGymRepository();
    sut = new RegisterGymUseCase(repository);
});

describe("RegisterGymUseCase", () => {
    it("should be able to register a gym", async () => {
        // Act
        const { gym } = await sut.execute({
            title: "Gym Title",
            description: "Gym Description",
            phone: "99 9 9999-9999",
            latitude: -22.8871799,
            longitude: -46.9474326,
        });

        // Assert
        expect(gym.id).toEqual(expect.any(String));
    });
});
