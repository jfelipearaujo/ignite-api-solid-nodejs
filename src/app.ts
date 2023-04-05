import fastify from "fastify";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { env, isDevelopment, isTest } from "./env";
import fastifyJwt from "@fastify/jwt";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
});

app.register(appRoutes);

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            error: "validation failed",
            issues: error.format(),
        });
    }

    if (isDevelopment() || isTest()) {
        console.log(error);
    } else {
        // TODO: add more info into error service here
    }

    return reply.status(500).send({
        error: "internal server error",
    });
});
