import { User } from "@prisma/client";
import { compare } from "bcryptjs";

import { UserRepository } from "@/repositories/users-repository";

import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

interface AuthenticateUserUseCaseRequest {
    email: string;
    password: string;
}

interface AuthenticateUserUseCaseResponse {
    user: User;
}

export class AuthenticateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute({
        email,
        password,
    }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const doesPasswordMatches = await compare(password, user.password_hash);

        if (!doesPasswordMatches) {
            throw new InvalidCredentialsError();
        }

        return {
            user,
        };
    }
}
