import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to search a gym", async () => {
        // Arrange
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Gym Title",
                description: "Gym Description",
                phone: "99 9 9999-9999",
                latitude: -22.8871799,
                longitude: -46.9474326,
            });

        // Act
        const response = await request(app.server)
            .get("/gyms/search")
            .query({
                query: "Gym",
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        // Assert
        expect(response.status).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "Gym Title",
            }),
        ]);
    });
});
