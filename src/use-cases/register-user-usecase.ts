import { User } from "@prisma/client";
import { hash } from "bcryptjs";

import { UserRepository } from "@/repositories/users-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUserUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterUserUseCaseResponse {
    user: User;
}

export class RegisterUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute({
        name,
        email,
        password,
    }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
        const userWithSameEmail = await this.userRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const password_hash = await hash(password, 6);

        const user = await this.userRepository.create({
            name,
            email,
            password_hash,
        });

        return {
            user,
        };
    }
}
