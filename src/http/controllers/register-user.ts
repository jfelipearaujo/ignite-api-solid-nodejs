import { z } from 'zod';
import {FastifyRequest, FastifyReply} from 'fastify';
import { registerUserUseCase } from '@/use-cases/register-user';

export async function registerUser(request:FastifyRequest, reply: FastifyReply) {
    const registerUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password : z.string().min(6)
    });

    const { name, email, password } = registerUserSchema.parse(request.body);

    try{
        await registerUserUseCase({name, email, password});
    }catch (err) {
        return reply.status(409).send();
    }

    return reply.status(201).send();
}