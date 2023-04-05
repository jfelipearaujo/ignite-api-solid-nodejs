import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-usecase";

export async function searchNearby(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const searchNearbyGymsQuerySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = searchNearbyGymsQuerySchema.parse(
        request.query,
    );

    const useCase = makeFetchNearbyGymsUseCase();

    const { gyms } = await useCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    });

    return reply.status(200).send({
        gyms,
    });
}
