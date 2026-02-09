import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m"
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d"

export { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY }

export function generateTokens(user) {
  const payload = { id: user.id, email: user.email }
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })
  return { accessToken, refreshToken }
}

export function setTokenCookies(res, accessToken, refreshToken) {
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
