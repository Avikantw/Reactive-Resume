import { z } from "zod";

const basicscSchema = z.object({
    name: z.string().optional(),
    email: z.literal("").or(z.string().email()),
    phone: z.string().optional(),
    headline: z.string().optional(),
    location: z.string().optional(),
});

export const txtResumeSchema = z.object({ basics: basicscSchema });

export type TXTResume = z.infer<typeof txtResumeSchema>;
