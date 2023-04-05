import { Gym, Prisma } from "@prisma/client";

export interface FetchManyNearbyParams {
    latitude: number;
    longitude: number;
}

export interface GymRepository {
    findById(id: string): Promise<Gym | null>;
    create(data: Prisma.GymCreateInput): Promise<Gym>;
    fetchMany(query: string, page: number): Promise<Gym[]>;
    fetchManyNearby(data: FetchManyNearbyParams): Promise<Gym[]>;
}
