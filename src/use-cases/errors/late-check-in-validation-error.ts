export class LateCheckInValidationError extends Error {
    constructor() {
        super("Check-in exceeded max allowed time to be validated");
    }
}
