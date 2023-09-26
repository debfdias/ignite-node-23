import fastify from "fastify"
import { checkinRoutes } from "./routes/checkin.routes"
import { gymRoutes } from "./routes/gym.routes"
import { usersRoutes } from "./routes/user.routes"

export const app = fastify()

app.register(usersRoutes)
app.register(gymRoutes)
app.register(checkinRoutes)
