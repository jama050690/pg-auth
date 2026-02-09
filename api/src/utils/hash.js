import crypto from "crypto"

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[_=&^%$#@!]).{8,}$/

export function md5Hash(str) {
  return crypto.createHash("md5").update(str).digest("hex")
}
