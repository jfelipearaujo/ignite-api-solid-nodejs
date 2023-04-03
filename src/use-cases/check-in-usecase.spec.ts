import {expect, describe, it, beforeEach, vi, afterEach} from 'vitest';
import { CheckInUseCase } from './check-in-usecase';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { randomUUID } from 'node:crypto';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInUseCase;

const gymId = randomUUID();

beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInUseCase(checkInRepository, gymRepository);

    gymRepository.items.push({
        id: gymId,
        title: 'Gym Title',
        description: 'Gym Description',
        phone: '99 9 9999-9999',
        latitude: new Decimal(0),
        longitude: new Decimal(0),
        create_at: new Date(),
        updated_at: new Date(),
    });

    vi.useFakeTimers();
});

afterEach(()=>{
    vi.useRealTimers();
});

describe('CheckInUseCase', () => {
    it('should be able to check in', async () => {
        // Act
        const date = new Date(2022, 0, 20, 8, 0, 0);
        vi.setSystemTime(date);

        const { checkIn } = await sut.execute({
            userId: randomUUID(),
            gymId,
            userLatitude: 0,
            userLongitude: 0,
        });
        
        // Assert
        expect(checkIn.id).toEqual(expect.any(String));
        expect(checkIn.create_at).toEqual(date);
    });

    it('should not be able to check in twice a day', async () => {
        // Arrange
        const date = new Date(2022, 0, 20, 8, 0, 0);
        vi.setSystemTime(date);

        const userId = randomUUID();

        await sut.execute({
            userId,
            gymId,
            userLatitude: 0,
            userLongitude: 0,
        });

        // Act + Assert
        await expect(() => 
            sut.execute({
                userId,
                gymId,
                userLatitude: 0,
                userLongitude: 0,
            })).rejects.toBeInstanceOf(Error);
    });

    it('should be able to check in twice in different days', async () => {
        // Arrange
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
        
        const userId = randomUUID();

        await sut.execute({
            userId,
            gymId,
            userLatitude: 0,
            userLongitude: 0,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        // Act
        const { checkIn } = await sut.execute({
            userId,
            gymId,
            userLatitude: 0,
            userLongitude: 0,
        });

        // Assert
        expect(checkIn.id).toEqual(expect.any(String));
    });

    it('should not be able to check in at a gym that its far away', async () => {
        // Act
        const farAwayGym = randomUUID();
        gymRepository.items.push({
            id: farAwayGym,
            title: 'Gym Title',
            description: 'Gym Description',
            phone: '99 9 9999-9999',
            latitude: new Decimal(-22.7682444),
            longitude: new Decimal(-47.1599113),
            create_at: new Date(),
            updated_at: new Date(),
        });
        
        const date = new Date(2022, 0, 20, 8, 0, 0);
        vi.setSystemTime(date);
        
        // Act + Assert
        await expect(() => sut.execute({
            userId: randomUUID(),
            gymId,
            userLatitude: -22.8829504,
            userLongitude: -46.9969626,
        })).rejects.toBeInstanceOf(Error);
    });
});