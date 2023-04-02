import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error';
import { makeAuthenticateUserUseCase } from '@/use-cases/factories/make-authenticate-user-usecase';

export async function authenticateUser(request:FastifyRequest, reply: FastifyReply) {
    const authenticateUserSchema = z.object({
        email: z.string().email(),
        password : z.string().min(6)
    });

    const { email, password } = authenticateUserSchema.parse(request.body);

    try {
        const authenticateUseCase = makeAuthenticateUserUseCase();

        await authenticateUseCase.execute({
            email,
            password
        });
    } catch (err) {
        if (err instanceof InvalidCredentialsError) {
            return reply.status(401).send({ 
                error: err.message 
            });
        }

        throw err;
    }

    return reply.status(200).send();
}