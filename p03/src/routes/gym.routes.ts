import { FastifyInstance } from "fastify"
import { nearby } from "../controllers/gym/nearby"
import { create } from "../controllers/gym/register"
import { search } from "../controllers/gym/search"
import { verifySession } from "../middlewares/verify-session"
import { verifyUserRole } from "../middlewares/verify-user-role"

export async function gymRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifySession)
  app.get("/gyms/search", search)
  app.get("/gyms/nearby", nearby)
  app.post("/gyms", { onRequest: [verifyUserRole("ADMIN")] }, create)
}
