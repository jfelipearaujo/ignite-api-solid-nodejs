import { hash } from 'bcryptjs';

interface RegisterUser {
    name: string;
    email: string;
    password: string;
}

export class RegisterUserUseCase {
    constructor(private usersRepository: any) {}

    async execute ({ name, email, password }: RegisterUser) {
        const userWithSameEmail = await this.usersRepository.findOneByEmail(email);

        if(userWithSameEmail) {
            throw new Error('Email already exists');
        }

        const password_hash = await hash(password, 6);

        await  this.usersRepository.create({ 
            name,
            email,
            password_hash
        });
    }
}