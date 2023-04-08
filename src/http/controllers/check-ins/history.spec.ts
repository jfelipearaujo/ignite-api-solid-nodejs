import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Check-in history (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to list the history of check-ins", async () => {
        // Arrange
        const { token } = await createAndAuthenticateUser(app, true);

        const createGymResponse = await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Gym Title",
                description: "Gym Description",
                phone: "99 9 9999-9999",
                latitude: -22.8871799,
                longitude: -46.9474326,
            });

        const { id: gymId } = createGymResponse.body.gym;

        await request(app.server)
            .post(`/gyms/${gymId}/check-ins`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                latitude: -22.8871799,
                longitude: -46.9474326,
            });

        // Act
        const response = await request(app.server)
            .get("/check-ins/history")
            .set("Authorization", `Bearer ${token}`)
            .send();

        // Assert
        expect(response.status).toEqual(200);
        expect(response.body.checkIns).toHaveLength(1);
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gym_id: gymId,
            }),
        ]);
    });
});
