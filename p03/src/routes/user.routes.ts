import { FastifyInstance } from "fastify"
import { authenticate } from "../controllers/user/authenticate"
import { profile } from "../controllers/user/profile"
import { refresh } from "../controllers/user/refresh"
import { register } from "../controllers/user/register"
import { verifySession } from "../middlewares/verify-session"

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)
  app.patch("/token/refresh", refresh)
  app.get("/me", { onRequest: [verifySession] }, profile)
}
