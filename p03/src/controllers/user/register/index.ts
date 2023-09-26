import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { registerUser } from "../../../useCases/registerUser"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUser({ name, email, password })

    // const registerUseCase = makeRegisterUseCase()

    // await registerUseCase.execute({
    //   name,
    //   email,
    //   password,
    // })
  } catch (err: any) {
    throw err
  }

  return reply.status(201).send()
}
