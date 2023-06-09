import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Get User Profile (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    it("should be able to get an user's profile", async () => {
        // Arrange
        const { token } = await createAndAuthenticateUser(app);

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
