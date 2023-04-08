import { FastifyInstance } from "fastify";

import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { create } from "./create";
import { search } from "./search";
import { searchNearby } from "./search-nearby";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);

    app.get("/gyms/search", search);
    app.get("/gyms/nearby", searchNearby);

    app.post(
        "/gyms",
        {
            onRequest: [verifyUserRole("ADMIN")],
        },
        create,
    );
}
