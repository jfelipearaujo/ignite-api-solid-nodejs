import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import {describe, expect, it} from 'vitest';
import { AuthenticateUserUseCase } from './authenticate-user-usecase';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

describe('AuthenticateUserUseCase', () => {
    it('should authenticate a user', async () => {
        // Arrange
        const repository = new InMemoryUserRepository();
        const sut = new AuthenticateUserUseCase(repository);
        
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
        const repository = new InMemoryUserRepository();
        const sut = new AuthenticateUserUseCase(repository);
        
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
        const repository = new InMemoryUserRepository();
        const sut = new AuthenticateUserUseCase(repository);
        
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