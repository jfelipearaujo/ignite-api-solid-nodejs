import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("AuthenticateUserController", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to authenticate an user", async () => {
        // Arrange
        await request(app.server).post("/users").send({
            name: "John Doe",
            email: "john.doe@email.com",
            password: "123456",
        });

        // Act
        const response = await request(app.server).post("/sessions").send({
            email: "john.doe@email.com",
            password: "123456",
        });

        // Assert
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String),
        });
    });
});
