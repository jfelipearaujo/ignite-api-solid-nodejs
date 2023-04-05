import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUserUseCase } from "@/use-cases/factories/make-register-user-usecase";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const registerUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    const { name, email, password } = registerUserSchema.parse(request.body);

    try {
        const useCase = makeRegisterUserUseCase();

        await useCase.execute({
            name,
            email,
            password,
        });
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({
                error: err.message,
            });
        }

        throw err;
    }

    return reply.status(201).send();
}
