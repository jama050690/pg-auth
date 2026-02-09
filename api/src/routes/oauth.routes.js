import { Router } from "express"
import pool from "../config/db.js"
import { generateTokens, setTokenCookies } from "../utils/token.js"

const router = Router()

// Helper: find or create OAuth user
async function findOrCreateOAuthUser(name, email, provider) {
  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email])
  if (existing.rows.length > 0) return existing.rows[0]

  const result = await pool.query(
    "INSERT INTO users (name, email, provider) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
    [name, email, provider]
  )
  return result.rows[0]
}

// === Google OAuth ===

router.get("/google", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/google/callback",
    response_type: "code",
    scope: "openid email profile",
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

router.get("/google/callback", async (req, res) => {
  const { code } = req.query
  if (!code) return res.redirect("http://localhost/login/")

  try {
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

router.get("/github", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: "http://localhost:3000/auth/github/callback",
    scope: "user:email",
  })
  res.redirect(`https://github.com/login/oauth/authorize?${params}`)
})

router.get("/github/callback", async (req, res) => {
  const { code } = req.query
  if (!code) return res.redirect("http://localhost/login/")

  try {
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

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const ghUser = await userRes.json()

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

export default router
