import { verifyJwt } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook("onRequest", verifyJwt);
}
