import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

import { prisma } from "@/lib/prisma";

export async function createAndAuthenticateUser(
    app: FastifyInstance,
    isAdmin = false,
) {
    await prisma.user.create({
        data: {
            name: "John Doe",
            email: "john.doe@email.com",
            password_hash: await hash("123456", 6),
            role: isAdmin ? "ADMIN" : "MEMBER",
        },
    });

    // await request(app.server).post("/users").send({
    //     name: "John Doe",
    //     email: "john.doe@email.com",
    //     password: "123456",
    // });

    const authResponse = await request(app.server).post("/sessions").send({
        email: "john.doe@email.com",
        password: "123456",
    });

    const { token } = authResponse.body;

    return {
        token,
    };
}
