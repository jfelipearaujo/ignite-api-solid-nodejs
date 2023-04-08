import { randomUUID } from "node:crypto";

import { Gym, Prisma } from "@prisma/client";

import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";

import { FetchManyNearbyParams, GymRepository } from "../gym-repository";

export class InMemoryGymRepository implements GymRepository {
    public items: Gym[] = [];

    async fetchManyNearby({ latitude, longitude }: FetchManyNearbyParams) {
        return this.items.filter((g) => {
            const MAX_DISTANCE_IN_KILOMETERS = 10;

            const distance = getDistanceBetweenCoordinates(
                {
                    latitude,
                    longitude,
                },
                {
                    latitude: g.latitude.toNumber(),
                    longitude: g.longitude.toNumber(),
                },
            );

            return distance <= MAX_DISTANCE_IN_KILOMETERS;
        });
    }

    async fetchMany(query: string, page: number): Promise<Gym[]> {
        return this.items
            .filter((g) => g.title.toLowerCase().includes(query.toLowerCase()))
            .slice((page - 1) * 20, page * 20);
    }

    async findById(id: string) {
        const gym = this.items.find((g) => g.id === id);

        if (!gym) {
            return null;
        }

        return gym;
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(gym);

        return gym;
    }
}
