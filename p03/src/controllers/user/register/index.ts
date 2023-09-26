import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "../../../useCases/registerUser"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUser = new RegisterUseCase(prismaUsersRepository)

    await registerUser.handle({ name, email, password })
  } catch (err: any) {
    throw err
  }

  return reply.status(201).send()
}
