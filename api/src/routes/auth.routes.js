import { Router } from "express"
import jwt from "jsonwebtoken"
import pool from "../config/db.js"
import { md5Hash, PASSWORD_REGEX } from "../utils/hash.js"
import {
  generateTokens,
  setTokenCookies,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
} from "../utils/token.js"

const router = Router()

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" })
  }
  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({ error: "Parol kamida 8 ta belgi, 1 katta harf, 1 raqam va 1 maxsus belgi (_=&^%$#@!) bo'lishi kerak" })
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" })
    }

    const passwordHash = md5Hash(password)
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, passwordHash]
    )
    const user = result.rows[0]

    const { accessToken, refreshToken } = generateTokens(user)
    setTokenCookies(res, accessToken, refreshToken)
    res.cookie("password_hash", passwordHash, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error("Register error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" })
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const user = result.rows[0]
    const passwordHash = md5Hash(password)
    if (passwordHash !== user.password_hash) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const { accessToken, refreshToken } = generateTokens(user)
    setTokenCookies(res, accessToken, refreshToken)
    res.cookie("password_hash", passwordHash, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Refresh access token
router.post("/refresh", (req, res) => {
  const token = req.cookies.refresh_token
  if (!token) return res.status(401).json({ error: "Refresh token required" })

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET)
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    )

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })

    res.json({ message: "Token refreshed" })
  } catch {
    return res.status(401).json({ error: "Invalid or expired refresh token" })
  }
})

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token")
  res.clearCookie("refresh_token")
  res.clearCookie("password_hash")
  res.json({ message: "Logged out successfully" })
})

export default router
