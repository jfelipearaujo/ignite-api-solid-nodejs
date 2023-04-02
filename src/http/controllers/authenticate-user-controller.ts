import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';
import { AuthenticateUserUseCase } from '@/use-cases/authenticate-user-usecase';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials.error';

export async function authenticateUser(request:FastifyRequest, reply: FastifyReply) {
    const authenticateUserSchema = z.object({
        email: z.string().email(),
        password : z.string().min(6)
    });

    const { email, password } = authenticateUserSchema.parse(request.body);

    try {
        const usersRepository = new PrismaUserRepository();
        const authenticateUseCase = new AuthenticateUserUseCase(usersRepository);

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