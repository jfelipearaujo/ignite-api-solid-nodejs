import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { search } from "./search";
import { searchNearby } from "./search-nearby";
import { create } from "./create";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);

    app.get("/gyms/search", search);
    app.get("/gyms/nearby", searchNearby);

    app.post("/gyms", create);
}
