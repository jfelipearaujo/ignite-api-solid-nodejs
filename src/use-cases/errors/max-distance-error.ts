export class MaxDistanceError extends Error {
    constructor() {
        super("The maximum distance between the user and the gym was exceeded");
    }
}
