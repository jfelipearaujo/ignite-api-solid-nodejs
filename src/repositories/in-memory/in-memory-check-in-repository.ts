import { randomUUID } from "node:crypto";

import { CheckIn, Prisma } from "@prisma/client";
import dayjs from "dayjs";

import { CheckInRepository } from "../check-in-repository";

export class InMemoryCheckInRepository implements CheckInRepository {
    public items: CheckIn[] = [];

    async findById(id: string) {
        const checkIn = this.items.find((c) => c.id === id);

        if (!checkIn) {
            return null;
        }

        return checkIn;
    }

    async countByUserId(userId: string): Promise<number> {
        return this.items.filter((c) => c.user_id === userId).length;
    }

    async findManyByUserId(userId: string, page: number) {
        return this.items
            .filter((c) => c.user_id === userId)
            .slice((page - 1) * 20, page * 20);
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfDay = dayjs(date).startOf("date");
        const endOfDay = dayjs(date).endOf("date");

        const checkIn = this.items.find((x) => {
            const checkInDate = dayjs(x.create_at);
            const isOnSameDate =
                checkInDate.isAfter(startOfDay) &&
                checkInDate.isBefore(endOfDay);

            return x.user_id === userId && isOnSameDate;
        });

        if (!checkIn) return null;

        return checkIn;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: data.id ?? randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validate_at: data.validate_at ? new Date(data.validate_at) : null,
            create_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(checkIn);

        return checkIn;
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex((c) => c.id === checkIn.id);

        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn;
        }

        return checkIn;
    }
}
