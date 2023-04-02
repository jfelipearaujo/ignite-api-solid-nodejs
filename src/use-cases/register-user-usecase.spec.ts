import {expect, describe, it} from 'vitest';
import { RegisterUserUseCase } from './register-user-usecase';
import { compare } from 'bcryptjs';
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('RegisterUseCase', () => {
    it('should be able to register an user', async () => {
        // Arrange
        const repository = new InMemoryUserRepository();
        const sut = new RegisterUserUseCase(repository);

        // Act
        const { user } = await sut.execute({
            name: 'John Doe',
            email: 'john_doe@example.com',
            password: '123456'
        });
        
        // Assert
        expect(user.id).toEqual(expect.any(String));
    });

    it('should hashing a password upon user registration', async () => {
        // Arrange
        const repository = new InMemoryUserRepository();
        const sut = new RegisterUserUseCase(repository);

        const password = '123456';

        // Act
        const { user: userResponse } = await sut.execute({
            name: 'John Doe',
            email: 'john_doe@example.com',
            password
        });
        
        // Assert
        const isPasswordCorrectlyHashed = await compare(password, userResponse.password_hash);

        expect(isPasswordCorrectlyHashed).toBeTruthy();
    });

    it('should not allow user registration with an existing email address', async () => {
        // Arrange
        const repository = new InMemoryUserRepository();
        const sut = new RegisterUserUseCase(repository);

        const email = 'john_doe@example.com';

        await sut.execute({
            name: 'John Doe',
            email,
            password: '123456'
        });

        // Act + Assert
        expect(() => 
            sut.execute({
                name: 'John Doe',
                email,
                password: '123456'
            })).rejects.toBeInstanceOf(UserAlreadyExistsError);
    });
});