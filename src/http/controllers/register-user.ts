import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {FastifyRequest, FastifyReply} from 'fastify';

export async function registerUser(request:FastifyRequest, reply: FastifyReply) {
    const registerUserSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password : z.string().min(6)
    });

    const { name, email, password } = registerUserSchema.parse(request.body);

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password
        }
    });

    return reply.status(201).send();
}