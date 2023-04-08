import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["dev", "test", "prod"]),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
});

const parseResult = envSchema.safeParse(process.env);

if (parseResult.success === false) {
    const errMsg = "invalid environment variables";
    console.log(errMsg, parseResult.error.format());
    throw new Error(errMsg);
}

export const env = parseResult.data;

export function isDevelopment() {
    return env.NODE_ENV === "dev";
}

export function isTest() {
    return env.NODE_ENV === "test";
}

export function isProduction() {
    return env.NODE_ENV === "prod";
}
