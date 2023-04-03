import { Gym } from '@prisma/client';
import { GymRepository } from '../gym-repository';

export class InMemoryGymRepository implements GymRepository {
    public items: Gym[] = [];

    async findById(id: string) {
        const gym = this.items.find(g => g.id === id);

        if (!gym) {
            return null; 
        }

        return gym;
    }    
}