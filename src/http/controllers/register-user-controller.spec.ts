import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import request from "supertest";

describe("RegisterUserController", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to register a user", async () => {
        // Arrange
        // Act
        const response = await request(app.server).post("/users").send({
            name: "John Doe",
            email: "john.doe@email.com",
            password: "123456",
        });

        // Assert
        expect(response.status).toEqual(201);
    });
});
