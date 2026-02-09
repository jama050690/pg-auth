import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/token.js"

export function authenticate(req, res, next) {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ error: "Access token required" })

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" })
  }
}
