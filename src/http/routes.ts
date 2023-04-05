import { FastifyInstance } from "fastify";
import { registerUser } from "./controllers/register-user-controller";
import { authenticateUser } from "./controllers/authenticate-user-controller";
import { userProfile } from "./controllers/user-profile-controller";
import { verifyJwt } from "./middlewares/verify-jwt";

export async function appRoutes(app: FastifyInstance) {
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
