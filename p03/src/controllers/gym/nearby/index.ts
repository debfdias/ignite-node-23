import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { PrismaGymsRepository } from "../../../repositories/prisma/prisma-gyms-repository"
import { GetNearbyGymsUseCase } from "../../../useCases/getNearbyGyms"

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query)

  const gymsRepository = new PrismaGymsRepository()
  const getNearbyGymsUseCase = new GetNearbyGymsUseCase(gymsRepository)

  const { gyms } = await getNearbyGymsUseCase.handle({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms,
  })
}
