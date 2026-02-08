import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import pool from "./db.js"

const app = express()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m"
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d"
const PORT = process.env.PORT || 3000

function md5Hash(str) {
  return crypto.createHash("md5").update(str).digest("hex")
}

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[_=&^%$#@!]).{8,}$/

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

// Get current user (protected)
app.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, provider, created_at FROM users WHERE id = $1",
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
  res.clearCookie("password_hash")
  res.json({ message: "Logged out successfully" })
})

// === Google OAuth ===

app.get("/auth/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query
  if (!code) return res.redirect("http://localhost/login/")

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/auth/google/callback",
        grant_type: "authorization_code",
      }),
    })
    const tokenData = await tokenRes.json()

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const googleUser = await userRes.json()

    const user = await findOrCreateOAuthUser(googleUser.name, googleUser.email, "google")
    const { accessToken, refreshToken } = generateTokens(user)
    setTokenCookies(res, accessToken, refreshToken)

    res.redirect("http://localhost/dashboard/")
  } catch (err) {
    console.error("Google OAuth error:", err)
    res.redirect("http://localhost/login/")
  }
})

// === GitHub OAuth ===

app.get("/auth/github", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/github/callback",
    scope: "user:email",
  })
  res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

app.get("/auth/github/callback", async (req, res) => {
  const { code } = req.query
  if (!code) return res.redirect("http://localhost/login/")

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })
    const tokenData = await tokenRes.json()

    // Get user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const ghUser = await userRes.json()

    // Get email (may be private)
    let email = ghUser.email
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const emails = await emailRes.json()
      const primary = emails.find(e => e.primary)
      email = primary?.email || emails[0]?.email
    }

    const user = await findOrCreateOAuthUser(ghUser.name || ghUser.login, email, "github")
    const { accessToken, refreshToken } = generateTokens(user)
    setTokenCookies(res, accessToken, refreshToken)

    res.redirect("http://localhost/dashboard/")
  } catch (err) {
    console.error("GitHub OAuth error:", err)
    res.redirect("http://localhost/login/")
  }
})

app.listen(PORT, () => console.info(`Server running on port ${PORT}`))
