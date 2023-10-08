import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaGymsRepository } from "../../../repositories/prisma/prisma-gyms-repository"
import { SearchGymsUseCase } from "../../../useCases/searchGyms"

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = searchGymsQuerySchema.parse(request.query)

  const gymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository)

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
