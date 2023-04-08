import { FastifyInstance } from "fastify";

import { authenticate } from "./authenticate";
import { create } from "./create";
import { profile } from "./profile";
import { refresh } from "./refresh";
import { verifyJwt } from "../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
    app.post("/users", create);
    app.post("/sessions", authenticate);

    app.patch("/token/refresh", refresh);

    /** Only for authenticated users */
    app.get(
        "/me",
        {
            onRequest: [verifyJwt],
        },
        profile,
    );
}
