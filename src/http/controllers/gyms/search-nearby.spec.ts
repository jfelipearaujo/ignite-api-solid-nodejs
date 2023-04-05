import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Nearby Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to search a nearby gym", async () => {
        // Arrange
        const { token } = await createAndAuthenticateUser(app);

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Near Gym",
                description: "Gym Description",
                phone: "99 9 9999-9999",
                latitude: -22.8871799,
                longitude: -46.9474326,
            });

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Far Gym",
                description: "Gym Description",
                phone: "99 9 9999-9999",
                latitude: -23.088236,
                longitude: -46.5284074,
            });

        // Act
        const response = await request(app.server)
            .get("/gyms/nearby")
            .query({
                latitude: -22.8875799,
                longitude: -46.9478326,
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        // Assert
        expect(response.status).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "Near Gym",
            }),
        ]);
    });
});
