import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeRegisterGymUseCase } from "@/use-cases/factories/make-register-gym-usecase";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const registerGymSchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { title, description, phone, latitude, longitude } =
        registerGymSchema.parse(request.body);

    const useCase = makeRegisterGymUseCase();

    const { gym } = await useCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    });

    return reply.status(201).send({
        gym: {
            id: gym.id,
        },
    });
}
