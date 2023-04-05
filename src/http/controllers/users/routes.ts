import { FastifyInstance } from "fastify";
import { registerUser } from "./create";
import { authenticateUser } from "./authenticate";
import { userProfile } from "./profile";
import { verifyJwt } from "../../middlewares/verify-jwt";

export async function usersRoutes(app: FastifyInstance) {
    app.post("/users", registerUser);
    app.post("/sessions", authenticateUser);

    /** Only for authenticated users */
    app.get(
        "/me",
        {
            onRequest: [verifyJwt],
        },
        userProfile,
    );
}
