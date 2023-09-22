import "dotenv/config"
import { z } from "zod"

const envVariablesSchema = z.object({
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  PORT: z.coerce.number().default(3333),
})

const _isValidEnv = envVariablesSchema.safeParse(process.env)

if (_isValidEnv.success === false) {
  console.error("🚨 Invalid environment variables!", _isValidEnv.error.format())

  throw new Error("Invalid environment variables!")
}

export const env = _isValidEnv.data
