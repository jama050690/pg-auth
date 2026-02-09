import { Router } from "express"
import pool from "../config/db.js"
import { authenticate } from "../middleware/auth.middleware.js"

const router = Router()

// Get current user (protected)
router.get("/me", authenticate, async (req, res) => {
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

export default router
