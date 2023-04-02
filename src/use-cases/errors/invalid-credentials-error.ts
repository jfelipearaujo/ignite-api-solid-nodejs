export class InvalidCredentialsError extends Error {
    constructor() {
        super('E-mail or password are incorrect or does not exists');
    }
}