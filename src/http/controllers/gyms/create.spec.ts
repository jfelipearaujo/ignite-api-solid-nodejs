import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to create a gym", async () => {
        // Arrange
        const { token } = await createAndAuthenticateUser(app);

        // Act
        const response = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Gym Title",
                description: "Gym Description",
                phone: "99 9 9999-9999",
                latitude: -22.8871799,
                longitude: -46.9474326,
            });

        // Assert
        expect(response.status).toEqual(201);
    });
});
