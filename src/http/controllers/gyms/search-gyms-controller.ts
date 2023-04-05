import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchGymsUseCase } from "@/use-cases/factories/make-fetch-gyms-usecase";

export async function searchGyms(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { query, page } = searchGymsQuerySchema.parse(request.params);

    const fetchGymsUseCase = makeFetchGymsUseCase();

    const { gyms } = await fetchGymsUseCase.execute({
        query,
        page,
    });

    return reply.status(200).send({
        gyms,
    });
}
