import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js"
import oauthRoutes from "./routes/oauth.routes.js"
import userRoutes from "./routes/user.routes.js"

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

// Health check
app.get("/", (req, res) => res.json({ ok: true }))

// Routes
app.use(authRoutes)
app.use(userRoutes)
app.use("/auth", oauthRoutes)

export default app
