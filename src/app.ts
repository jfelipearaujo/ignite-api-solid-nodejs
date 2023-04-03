import fastify from "fastify";
import { appRoutes } from "./http/routes";
import { ZodError } from "zod";
import { isDevelopment, isTest } from "./env";

export const app = fastify();

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
