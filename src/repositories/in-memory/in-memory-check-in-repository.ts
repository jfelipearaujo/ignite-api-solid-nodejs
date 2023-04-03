import { CheckIn, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { CheckInRepository } from '../check-in-repository';

export class InMemoryCheckInRepository implements CheckInRepository {
    public items: CheckIn[] = [];

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validate_at: data.validate_at ? new Date(data.validate_at) : null,
            create_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(checkIn);

        return checkIn;
    }
}