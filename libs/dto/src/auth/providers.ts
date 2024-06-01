import { createZodDto } from "nestjs-zod/dto";
import { z } from "nestjs-zod/z";

const authProvidersSchema = z.array(z.enum(["email", "github", "google", "linkedin", "facebook"]));

export class AuthProvidersDto extends createZodDto(authProvidersSchema) {}
