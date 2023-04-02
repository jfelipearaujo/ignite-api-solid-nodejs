import { isDevelopment } from '@/env';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
    log: isDevelopment() ? ['query']: []
});