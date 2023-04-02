import { UsersRepository } from '@/repositories/users-repository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

interface RegisterUser {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute ({ name, email, password }: RegisterUser) {
        const userWithSameEmail = await this.usersRepository.findOneByEmail(email);

        if(userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const password_hash = await hash(password, 6);

        await  this.usersRepository.create({ 
            name,
            email,
            password_hash
        });
    }
}