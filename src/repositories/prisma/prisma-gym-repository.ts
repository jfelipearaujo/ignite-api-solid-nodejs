import { Gym, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import { FetchManyNearbyParams, GymRepository } from "../gym-repository";

export class PrismaGymRepository implements GymRepository {
    async findById(id: string) {
        const gym = await prisma.gym.findUnique({
            where: {
                id,
            },
        });

        return gym;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = await prisma.gym.create({
            data,
        });

        return gym;
    }

    async fetchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                },
            },
            take: 20,
            skip: (page - 1) * 20,
        });

        return gyms;
    }

    async fetchManyNearby({ latitude, longitude }: FetchManyNearbyParams) {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= 10 -- 10 kilometers
        `;

        return gyms;
    }
}
