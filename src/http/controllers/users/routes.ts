import { FastifyInstance } from "fastify";
import { registerUser } from "./register-user-controller";
import { authenticateUser } from "./authenticate-user-controller";
import { userProfile } from "./user-profile-controller";
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
