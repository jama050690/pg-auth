import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "./db.js"

const app = express()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m"
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d"
const SALT_ROUNDS = 10
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

// === Helper functions ===

function generateTokens(user) {
  const payload = { id: user.id, email: user.email }
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })
  return { accessToken, refreshToken }
}

function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  })
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

function authenticate(req, res, next) {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ error: "Access token required" })

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid or expired access token" })
  }
}

// === OAuth helpers ===

async function findOrCreateOAuthUser(name, email, provider) {
  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email])
  if (existing.rows.length > 0) return existing.rows[0]

  const result = await pool.query(
    "INSERT INTO users (name, email, provider) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
    [name, email, provider]
  )
  return result.rows[0]
}

// === Routes ===

// Health check
app.get("/", (req, res) => res.json({ ok: true }))

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" })
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, passwordHash]
    )
    const user = result.rows[0]

    const { accessToken, refreshToken } = generateTokens(user)
    setTokenCookies(res, accessToken, refreshToken)

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
app.post("/login", async (req, res) => {
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
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" })
    }

    const { accessToken, refreshToken } = generateTokens(user)
    setTokenCookies(res, accessToken, refreshToken)

    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (err) {
    console.error("Login error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get current user (protected)
app.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [req.user.id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json({ user: result.rows[0] })
  } catch (err) {
    console.error("Get user error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Refresh access token
app.post("/refresh", (req, res) => {
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
app.post("/logout", (req, res) => {
  res.clearCookie("access_token")
  res.clearCookie("refresh_token")
  res.json({ message: "Logged out successfully" })
})

app.listen(PORT, () => console.info(`Server running on port ${PORT}`))
