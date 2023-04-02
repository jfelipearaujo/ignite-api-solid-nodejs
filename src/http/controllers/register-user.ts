import { z } from 'zod';
import {FastifyRequest, FastifyReply} from 'fastify';
import { RegisterUserUseCase } from '@/use-cases/register-user';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error';

export async function registerUser(request:FastifyRequest, reply: FastifyReply) {
    const registerUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password : z.string().min(6)
    });

    const { name, email, password } = registerUserSchema.parse(request.body);

    try{
        const usersRepository = new PrismaUsersRepository();
        const registerUserUseCase = new RegisterUserUseCase(usersRepository);

        await registerUserUseCase.execute({
            name,
            email,
            password
        });
    }catch (err) {
        if (err instanceof UserAlreadyExistsError) {
            return reply.status(409).send({ 
                error: err.message 
            });
        }

        return reply.status(500).send(); // TODO: better error handling
    }

    return reply.status(201).send();
}