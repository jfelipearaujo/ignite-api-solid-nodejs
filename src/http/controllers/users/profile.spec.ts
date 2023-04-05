import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("UserProfileController", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to get an user's profile", async () => {
        // Arrange
        await request(app.server).post("/users").send({
            name: "John Doe",
            email: "john.doe@email.com",
            password: "123456",
        });

        const authResponse = await request(app.server).post("/sessions").send({
            email: "john.doe@email.com",
            password: "123456",
        });

        const { token } = authResponse.body;

        // Act
        const response = await request(app.server)
            .get("/me")
            .set("Authorization", `Bearer ${token}`)
            .send();

        // Assert
        expect(response.status).toEqual(200);
        expect(response.body.user).toEqual(
            expect.objectContaining({
                name: "John Doe",
                email: "john.doe@email.com",
            }),
        );
    });
});
