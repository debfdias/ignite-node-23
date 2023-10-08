import { FastifyReply, FastifyRequest } from "fastify"
import { PrismaUsersRepository } from "../../../repositories/prisma/prisma-users-repository"
import { GetUserProfileUseCase } from "../../../useCases/getProfile"

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRepository)

  const { user } = await useCase.handle({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
