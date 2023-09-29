import fastify from "fastify"
import { ZodError } from "zod"
import { env } from "./env"
import { checkinRoutes } from "./routes/checkin.routes"
import { gymRoutes } from "./routes/gym.routes"
import { usersRoutes } from "./routes/user.routes"

export const app = fastify()

app.register(usersRoutes)
app.register(gymRoutes)
app.register(checkinRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() })
  }

  if (env.NODE_ENV !== "production") {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." })
})
