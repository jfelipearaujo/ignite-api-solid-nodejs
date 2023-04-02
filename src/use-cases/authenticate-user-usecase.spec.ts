import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import {beforeEach, describe, expect, it} from 'vitest';
import { AuthenticateUserUseCase } from './authenticate-user-usecase';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let repository: InMemoryUserRepository;
let sut: AuthenticateUserUseCase;

beforeEach(() => {
    repository = new InMemoryUserRepository();
    sut = new AuthenticateUserUseCase(repository);
});

describe('AuthenticateUserUseCase', () => {
    it('should authenticate a user', async () => {
        // Arrange
        const email = 'john.doe@email.com';
        const password = '123456';

        await repository.create({
            name: 'John Doe',
            email,
            password_hash: await hash(password, 6)
        });

        // Act
        const { user } = await sut.execute({
            email,
            password
        });

        // Assert
        expect(user.id).toEqual(expect.any(String));
    });

    it('should not able to authenticate a user with wrong email', async () => {
        // Arrange
        const email = 'john.doe@email.com';
        const password = '123456';

        // Act + Assert
        await expect(() => sut.execute({
            email,
            password
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not able to authenticate a user with wrong password', async () => {
        // Arrange
        const email = 'john.doe@email.com';
        const password = '123456';

        await repository.create({
            name: 'John Doe',
            email,
            password_hash: await hash(password, 6)
        });

        // Act + Assert
        await expect(() => sut.execute({
            email,
            password: 'wrong'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});