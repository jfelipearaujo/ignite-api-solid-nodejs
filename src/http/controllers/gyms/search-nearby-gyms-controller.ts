import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-usecase";

export async function searchNearbyGyms(
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
        request.params,
    );

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();

    const { gyms } = await fetchNearbyGymsUseCase.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    });

    return reply.status(200).send({
        gyms,
    });
}
