import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile-usecase";

let repository: InMemoryUserRepository;
let sut: GetUserProfileUseCase;

beforeEach(() => {
    repository = new InMemoryUserRepository();
    sut = new GetUserProfileUseCase(repository);
});

describe("GetUserProfileUseCase", () => {
    it("should be able to get a user's profile", async () => {
        // Arrange
        const email = "john.doe@email.com";
        const password = "123456";

        const { id } = await repository.create({
            name: "John Doe",
            email,
            password_hash: await hash(password, 6),
        });

        // Act
        const { user } = await sut.execute({ userId: id });

        // Assert
        expect(user.id).toEqual(id);
    });

    it("should not be able to get an user profile if does not exists", async () => {
        // Act + Assert
        await expect(() =>
            sut.execute({ userId: "non-existing-id" }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError);
    });
});
