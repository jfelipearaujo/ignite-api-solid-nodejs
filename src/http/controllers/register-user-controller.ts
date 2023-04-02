import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserUseCase } from '@/use-cases/register-user-usecase';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export async function registerUser(request:FastifyRequest, reply: FastifyReply) {
    const registerUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password : z.string().min(6)
    });

    const { name, email, password } = registerUserSchema.parse(request.body);

    try {
        const usersRepository = new PrismaUserRepository();
        const registerUserUseCase = new RegisterUserUseCase(usersRepository);

        await registerUserUseCase.execute({
            name,
            email,
            password
        });
    } catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ 
                error: err.message 
            });
        }

        throw err;
    }

    return reply.status(201).send();
}