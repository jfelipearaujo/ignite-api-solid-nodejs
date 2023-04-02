import {expect, describe, it} from 'vitest';
import { RegisterUserUseCase } from './register-user-usecase';
import { compare } from 'bcryptjs';

describe('RegisterUseCase', () => {
    it('should hashing a password upon user registration', async () => {
        const registerUserUseCase = new RegisterUserUseCase({
            async findOneByEmail(email) {
                return null;
            },

            async create(data) {
                return {
                    id: '1',
                    name: data.name,
                    email: data.email,
                    password_hash: data.password_hash,
                    create_at: new Date(),
                    updated_at: new Date(),
                };
            }
        });

        const password = '123456';

        const { user: userResponse } = await registerUserUseCase.execute({
            name: 'John Doe',
            email: 'john_doe@example.com',
            password
        });

        const isPasswordCorrectlyHashed = await compare(password, userResponse.password_hash);

        expect(isPasswordCorrectlyHashed).toBeTruthy();
    });
});