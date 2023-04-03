import {expect, describe, it, beforeEach} from 'vitest';
import { CheckInUseCase } from './check-in-usecase';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { randomUUID } from 'node:crypto';

let repository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

beforeEach(() => {
    repository = new InMemoryCheckInRepository();
    sut = new CheckInUseCase(repository);
});

describe('CheckInUseCase', () => {
    it('should be able to check in', async () => {
        // Act
        const { checkIn } = await sut.execute({
            userId: randomUUID(),
            gymId: randomUUID(),
        });
        
        // Assert
        expect(checkIn.id).toEqual(expect.any(String));
    });
});