import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { searchGyms } from "./search-gyms-controller";
import { searchNearbyGyms } from "./search-nearby-gyms-controller";
import { registerGym } from "./register-gym-controller";

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);

    app.get("/gyms/search", searchGyms);
    app.get("/gyms/nearby", searchNearbyGyms);

    app.post("/gyms", registerGym);
}
