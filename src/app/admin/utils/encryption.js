import CryptoJS from "crypto-js"

// ─────────────────────────────────────────────────────────────────────────────
// Three systems — mirrored from the mobile app (call_api.dart / encrypt.js.dart)
//
// Environment matrix (set in CI/CD env vars per deploy target):
//
//   Variable                    Dev          QA/Prod
//   ─────────────────────────── ──────────── ────────────────────────────────
//   NEXT_PUBLIC_BASE_URL        getcapsadev  getcapsaquality / getcapsa
//   NEXT_PUBLIC_ENCRYPT_PAYLOAD false        true
//   NEXT_PUBLIC_ENCRYPTION_KEY  dev key      qa/prod key  (base64, 32 bytes)
//   NEXT_PUBLIC_ENCRYPTION_IV   dev IV       qa/prod IV   (base64, 16 bytes)
// ─────────────────────────────────────────────────────────────────────────────

const ENCRYPT_ENABLED = process.env.NEXT_PUBLIC_ENCRYPT_PAYLOAD === "true"

const KEY = (() => {
  try { return CryptoJS.enc.Base64.parse(process.env.NEXT_PUBLIC_ENCRYPTION_KEY ?? "") }
  catch { return null }
})()

const IV = (() => {
  try { return CryptoJS.enc.Base64.parse(process.env.NEXT_PUBLIC_ENCRYPTION_IV ?? "") }
  catch { return null }
})()

const AES_CFG = { iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }

// ─── System 1: Request Payload Encryption ────────────────────────────────────
//
// Every API call body is encrypted when ENCRYPT_ENABLED=true.
// Wrapped as:  { payload: "<base64-AES-CBC>" }
// If disabled: original object is returned unchanged.
//
export const encryptPayload = (data) => {
  if (!ENCRYPT_ENABLED || !KEY || !IV) return data
  try {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), KEY, AES_CFG)
    return { payload: encrypted.toString() }
  } catch (err) {
    console.error("[encryption] encryptPayload failed:", err)
    return data   // fall back to plain so the request still goes through
  }
}

// ─── System 2: Signin / Signup Response Decryption ───────────────────────────
//
// ONLY called for URLs that contain 'signin/' or 'signup/'.
// The server returns an AES-CBC base64 string (possibly wrapped in outer quotes).
// Uses the same environment key/IV as System 1.
//
export const decryptSigninResponse = (rawResponseString) => {
  if (!KEY || !IV) return rawResponseString
  try {
    // Strip surrounding double-quotes if the server wraps the cipher in a JSON string
    // e.g.  "\"<base64>\"" → "<base64>"
    const cipher = rawResponseString.startsWith('"') && rawResponseString.endsWith('"')
      ? rawResponseString.slice(1, -1)
      : rawResponseString

    const decrypted = CryptoJS.AES.decrypt(cipher, KEY, AES_CFG)
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  } catch (err) {
    console.error("[encryption] decryptSigninResponse failed:", err)
    return rawResponseString
  }
}

// ─── System 3: Password Hashing ──────────────────────────────────────────────
//
// Converts each character → hex, then inserts a random letter between every
// hex digit.  "a" → "61" → "X6Y1" (X, Y are random alpha chars).
// Used before sending password in login / signup API calls.
//
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const rndChar = () => ALPHA[Math.floor(Math.random() * ALPHA.length)]

export const hashPassword = (password) =>
  password
    .split("")
    .map((ch) =>
      ch.charCodeAt(0)
        .toString(16)
        .padStart(2, "0")
        .split("")
        .map((hexDigit) => rndChar() + hexDigit)
        .join("")
    )
    .join("")
