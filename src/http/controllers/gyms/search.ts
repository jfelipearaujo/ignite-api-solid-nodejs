import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchGymsUseCase } from "@/use-cases/factories/make-fetch-gyms-usecase";

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { query, page } = searchGymsQuerySchema.parse(request.query);

    const useCase = makeFetchGymsUseCase();

    const { gyms } = await useCase.execute({
        query,
        page,
    });

    return reply.status(200).send({
        gyms,
    });
}
