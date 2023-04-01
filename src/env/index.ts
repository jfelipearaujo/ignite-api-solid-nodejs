import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'prod']),
    PORT: z.coerce.number()
})

const parseResult = envSchema.safeParse(process.env)

if (parseResult.success === false) {
    const errMsg = "invalid environment variables"
    console.log(errMsg, parseResult.error.format())
    throw new Error(errMsg)
}

export const env = parseResult.data