// server.js · Buka Boss: Lagos Street Kitchen & Cook-Off
// Official Vatar Games SDK v1 Backend Server (Node 18+, zero external runtime dependencies)
// Spec reference: https://lagoslife.app/developers/docs

import http from "node:http"
import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 3000)
const HOST = "0.0.0.0"

// Vatar API configuration (https://lagoslife.app/developers/docs#server)
const VATAR_API_BASE = process.env.VATAR_API_BASE || "https://lagoslife.app/api/games/v1"
const VATAR_SECRET = process.env.VATAR_SECRET || "vtr_test_local_sandbox_secret_key"
const VATAR_WEBHOOK_SECRET = process.env.VATAR_WEBHOOK_SECRET || "vtr_whsec_test_local_sandbox_webhook_secret"
const VATAR_RESULTS_SECRET = process.env.VATAR_RESULTS_SECRET || "vtr_res_test_local_sandbox_results_secret"
const IS_LIVE_KEY = VATAR_SECRET.startsWith("vtr_live_") && !VATAR_SECRET.includes("local_sandbox")
const IS_REAL_VATAR_KEY = !VATAR_SECRET.includes("local_sandbox")

// Official Product Catalog (Review Checklist #6: Clear names, honest prices ₦100–₦50,000, <= 20 items)
export const PRODUCT_CATALOG = {
  spices_pack_100: {
    id: "spices_pack_100",
    name: "Secret Yaji Spice Pack",
    desc: "+500 Gold Peppers & 3 Instant Grill Rush Boosters",
    amount: 100,
    currency: "NGN",
    kind: "consumable",
    grant: { peppers: 500, rushBoosts: 3 },
  },
  gen_fuel_200: {
    id: "gen_fuel_200",
    name: "Diesel & Auto-Chef Pack",
    desc: "+1,200 Gold Peppers, 3 Mama Bisi Auto-Servers & 3 Sweet Jara Refills",
    amount: 200,
    currency: "NGN",
    kind: "consumable",
    grant: { peppers: 1200, autoChefs: 3, jaraRefills: 3 },
  },
  double_tips_300: {
    id: "double_tips_300",
    name: "VIP Tip Jar (Permanent 2× Tips)",
    desc: "One-off upgrade: Every customer pays 2× Naira tips permanently",
    amount: 300,
    currency: "NGN",
    kind: "one_off",
    grant: { permanentUpgrade: "double_tips", peppers: 300 },
  },
  owambe_crate_500: {
    id: "owambe_crate_500",
    name: "Owambe Party Crate",
    desc: "+3,500 Gold Peppers + 5 Instant Rush + 5 Auto-Servers + 5 Jara Refills",
    amount: 500,
    currency: "NGN",
    kind: "consumable",
    grant: { peppers: 3500, rushBoosts: 5, autoChefs: 5, jaraRefills: 5 },
  },
  solar_inverter_500: {
    id: "solar_inverter_500",
    name: "Eko Solar Inverter",
    desc: "One-off upgrade: Immune to NEPA blackouts forever + 25% faster grill speed",
    amount: 500,
    currency: "NGN",
    kind: "one_off",
    grant: { permanentUpgrade: "solar_inverter", peppers: 500 },
  },
  golden_suya_pass_1500: {
    id: "golden_suya_pass_1500",
    name: "Odogwu Kitchen Pass",
    desc: "One-off pass: Unlocks all 4 Lagos kitchens immediately + Golden Grill Knife + 2× Leaderboard Score multiplier + 2,500 Gold Peppers",
    amount: 1500,
    currency: "NGN",
    kind: "one_off",
    grant: {
      permanentUpgrade: "odogwu_pass",
      unlockAllKitchens: true,
      peppers: 2500,
      rushBoosts: 5,
      autoChefs: 5,
    },
  },
}

// Persistent JSON data store (saves player state, delivered purchases, webhook ids, and checklist status)
const DATA_DIR = path.join(__dirname, "data")
const STORE_PATH = path.join(DATA_DIR, "store.json")
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"))
    }
  } catch (e) {
    console.error("Failed to read store.json, starting fresh:", e.message)
  }
  return {
    players: {},
    deliveredPurchases: {},
    sandboxPurchases: {},
    sandboxMatches: {},
    handledWebhooks: {},
    leaderboard: [
      { playerId: "p_eko_01", name: "ChiefObi_VI", score: 48500 },
      { playerId: "p_eko_02", name: "SuyaQueen_Yaba", score: 39200 },
      { playerId: "p_eko_03", name: "ToluTechBro", score: 31800 },
      { playerId: "p_eko_04", name: "AmalaBoss_Shitta", score: 26400 },
      { playerId: "p_eko_05", name: "DanfoKing_Oshodi", score: 19750 },
      { playerId: "p_eko_06", name: "MamaBisi_Surulere", score: 15200 },
      { playerId: "p_eko_07", name: "Odogwu_Lekki", score: 11800 },
    ],
    checklist: {
      sdkInitSeen: false,
      testPurchaseMade: false,
      purchaseVerifiedByServer: false,
      purchaseMarkedDelivered: false,
      webhookAnswered2xx: false,
      matchCreatedJoinedSettled: false,
    },
  }
}

const store = loadStore()
function saveStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8")
  } catch (e) {
    console.error("Failed to save store.json:", e.message)
  }
}

function getOrCreatePlayer(playerId, name = "Lagosian") {
  if (!store.players[playerId]) {
    store.players[playerId] = {
      playerId,
      name,
      nairaEarned: 1500,
      peppers: 150,
      bestScore: 0,
      shiftsPlayed: 0,
      ordersServed: 0,
      unlockedKitchens: ["yaba_suya"],
      kitchenLevels: {
        yaba_suya: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
        shitta_amala: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
        ikeja_shawarma: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
        vi_quilox: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
      },
      boosters: {
        rushBoosts: 2,
        autoChefs: 1,
        jaraRefills: 2,
      },
      ownedOneOffs: [],
      purchases: [],
      matchesWon: 0,
      matchesPlayed: 0,
      updatedAt: Date.now(),
    }
    saveStore()
  } else if (name && name !== "Lagosian") {
    store.players[playerId].name = name
  }
  return store.players[playerId]
}

// Helper: Call Vatar API (or resolve against built-in sandbox when testing locally before live keys)
async function callVatarApi(endpoint, body = null, customHeaders = {}) {
  // Check if this is a local sandbox token/purchase/match
  if (endpoint === "/session/verify" && body?.session?.startsWith("vtr1_sandbox.")) {
    try {
      const payload = JSON.parse(Buffer.from(body.session.split(".")[1], "base64url").toString("utf8"))
      if (payload.exp < Date.now()) {
        return { http: 401, error: "expired", message: "Session token expired" }
      }
      return {
        http: 200,
        playerId: payload.playerId,
        name: payload.name,
        gameId: payload.gameId || "buka_boss_draft",
        exp: payload.exp,
        mode: payload.mode || "test",
      }
    } catch {
      return { http: 401, error: "invalid_token", message: "Invalid session token" }
    }
  }

  const purchaseMatch = endpoint.match(/^\/purchases\/([a-zA-Z0-9_-]+)(\/deliver)?$/)
  if (purchaseMatch) {
    const pid = purchaseMatch[1]
    const isDeliver = Boolean(purchaseMatch[2])
    if (store.sandboxPurchases[pid]) {
      const sp = store.sandboxPurchases[pid]
      if (isDeliver) {
        if (sp.status === "refunded") return { http: 409, error: "refunded" }
        sp.status = "delivered"
        sp.deliveredAt = Date.now()
        store.checklist.purchaseMarkedDelivered = true
        saveStore()
        return { http: 200, id: sp.id, status: "delivered", deliveredAt: sp.deliveredAt }
      } else {
        store.checklist.purchaseVerifiedByServer = true
        saveStore()
        return { http: 200, ...sp }
      }
    }
  }

  const matchSettle = endpoint.match(/^\/matches\/([a-zA-Z0-9_-]+)\/result$/)
  if (matchSettle && store.sandboxMatches[matchSettle[1]]) {
    const mid = matchSettle[1]
    const m = store.sandboxMatches[mid]
    // Verify the exact 5-line HMAC-SHA256 signature required by Vatar Games Spec §7!
    const ts = customHeaders["X-Vatar-Timestamp"] || ""
    const sigHeader = customHeaders["X-Vatar-Signature"] || ""
    const fullPath = `/api/games/v1/matches/${mid}/result`
    const rawBody = JSON.stringify(body)
    const sha = crypto.createHash("sha256").update(rawBody).digest("hex")
    const expectedSig =
      "v1=" +
      crypto
        .createHmac("sha256", VATAR_RESULTS_SECRET)
        .update(["POST", fullPath, ts, m.nonce, sha].join("\n"))
        .digest("hex")

    if (sigHeader !== expectedSig) {
      return { http: 401, error: "bad_signature", message: "Match result HMAC signature mismatch" }
    }
    const nowSec = Math.floor(Date.now() / 1000)
    if (Math.abs(nowSec - Number(ts)) > 300) {
      return { http: 401, error: "stale_timestamp", message: "Timestamp outside 5-minute window" }
    }
    if (m.status === "done") {
      if (m.winner === body.winner) return { http: 200, ...m }
      return { http: 409, error: "already_settled" }
    }
    m.status = "done"
    m.winner = body.winner
    m.result = body.winner === "draw" ? "draw" : "win"
    m.settledAt = Date.now()
    const totalPot = (m.stake || 0) * (m.seats || 2)
    const houseCut = Math.floor(totalPot * 0.05)
    m.pot = totalPot
    m.payout = body.winner === "draw" ? m.stake : totalPot - houseCut
    m.creatorShare = Math.floor(houseCut * 0.4) // 40% of house cut goes to creator!
    store.checklist.matchCreatedJoinedSettled = true
    saveStore()
    return { http: 200, ...m }
  }

  // Forward to live/sandbox Vatar Games API at https://lagoslife.app/api/games/v1
  try {
    const r = await fetch(VATAR_API_BASE + endpoint, {
      method: body ? "POST" : "GET",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        Authorization: `Bearer ${VATAR_SECRET}`,
        "Content-Type": "application/json",
        ...customHeaders,
      },
    })
    const data = await r.json().catch(() => ({}))
    return { http: r.status, ...data }
  } catch (err) {
    return { http: 500, error: "error", message: err.message }
  }
}

// Grant item idempotently once per purchaseId (Vatar Spec §6)
function grantPurchaseToPlayer(playerId, productId, purchaseId) {
  if (store.deliveredPurchases[purchaseId]) {
    return { alreadyGranted: true, player: getOrCreatePlayer(playerId) }
  }
  const product = PRODUCT_CATALOG[productId]
  if (!product) {
    throw new Error(`Unknown productId: ${productId}`)
  }
  const player = getOrCreatePlayer(playerId)
  const g = product.grant

  if (g.peppers) player.peppers = (player.peppers || 0) + g.peppers
  if (g.rushBoosts) player.boosters.rushBoosts = (player.boosters.rushBoosts || 0) + g.rushBoosts
  if (g.autoChefs) player.boosters.autoChefs = (player.boosters.autoChefs || 0) + g.autoChefs
  if (g.jaraRefills) player.boosters.jaraRefills = (player.boosters.jaraRefills || 0) + g.jaraRefills
  if (g.permanentUpgrade && !player.ownedOneOffs.includes(productId)) {
    player.ownedOneOffs.push(productId)
  }
  if (g.unlockAllKitchens) {
    for (const k of ["yaba_suya", "shitta_amala", "ikeja_shawarma", "vi_quilox"]) {
      if (!player.unlockedKitchens.includes(k)) player.unlockedKitchens.push(k)
    }
  }
  player.purchases.push({
    purchaseId,
    productId,
    amount: product.amount,
    deliveredAt: Date.now(),
  })
  player.updatedAt = Date.now()

  store.deliveredPurchases[purchaseId] = {
    purchaseId,
    productId,
    playerId,
    amount: product.amount,
    deliveredAt: Date.now(),
  }
  saveStore()
  return { alreadyGranted: false, player, product }
}

// Constant-time webhook signature verification (Vatar Spec §9)
function verifyWebhookSignature(rawBuffer, headerVal) {
  const expected = Buffer.from(
    "sha256=" + crypto.createHmac("sha256", VATAR_WEBHOOK_SECRET).update(rawBuffer).digest("hex")
  )
  const received = Buffer.from(String(headerVal ?? ""))
  return expected.length === received.length && crypto.timingSafeEqual(expected, received)
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > 1e6) {
        reject(new Error("Payload too large"))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", reject)
  })
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data)
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  })
  res.end(body)
}

// Required CSP header so Lagos Life (and Vatar worlds) can frame the game
// See https://lagoslife.app/developers/docs#start Step 02
function getFrameAncestorsHeader() {
  const vatarOrigins =
    "https://lagoslife.app https://www.lagoslife.app https://naijalife.app https://www.naijalife.app https://lagoslife.eliysites.com"
  if (process.env.STRICT_VATAR_CSP === "1") {
    return `frame-ancestors ${vatarOrigins}`
  }
  // Allow Vatar origins plus self & preview host so developers can test in sandbox & browser preview
  return `frame-ancestors ${vatarOrigins} 'self' https://*.e2b.app http://localhost:* http://127.0.0.1:*`
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`)
    const pathname = url.pathname

    // Attach Content-Security-Policy frame-ancestors on all responses (and NEVER X-Frame-Options: DENY)
    res.setHeader("Content-Security-Policy", getFrameAncestorsHeader())

    // ------------------------------------------------------------------------
    // 1. OFFICIAL VATAR PURCHASE CLAIM ENDPOINT (POST /claim & POST /api/claim)
    // Follows https://lagoslife.app/developers/docs#server
    // ------------------------------------------------------------------------
    if (req.method === "POST" && (pathname === "/claim" || pathname === "/api/claim")) {
      const raw = await readRawBody(req)
      let body
      try {
        body = JSON.parse(raw.toString("utf8"))
      } catch {
        return sendJson(res, 400, { error: "bad_request", message: "Invalid JSON" })
      }
      const { session, purchaseId } = body || {}
      if (!session || !purchaseId) {
        return sendJson(res, 400, { error: "bad_request", message: "Missing session or purchaseId" })
      }

      // 1. Verify who is asking via POST /session/verify
      const me = await callVatarApi("/session/verify", { session })
      if (me.http !== 200 || !me.playerId) {
        return sendJson(res, 403, { error: me.error || "invalid_token", message: "Session verification failed" })
      }

      // 2. Check purchase with GET /purchases/{id}
      const p = await callVatarApi(`/purchases/${encodeURIComponent(purchaseId)}`)
      if (p.http !== 200 || p.playerId !== me.playerId) {
        return sendJson(res, 403, { error: p.error || "not_found", message: "Purchase could not be verified for player" })
      }
      if (p.status === "refunded") {
        return sendJson(res, 409, { error: "refunded", message: "Purchase was refunded" })
      }

      // 3. Grant the item once per purchaseId in our database
      const granted = grantPurchaseToPlayer(p.playerId, p.productId, p.id)

      // 4. Mark it delivered with Vatar API (POST /purchases/{id}/deliver — safe to repeat)
      const deliv = await callVatarApi(`/purchases/${encodeURIComponent(p.id)}/deliver`, {})
      store.checklist.purchaseVerifiedByServer = true
      store.checklist.purchaseMarkedDelivered = true
      saveStore()
      console.log(`💳 [VATAR PURCHASE DELIVERED] player=${p.playerId} product=${p.productId} purchaseId=${p.id} mode=${p.mode || "live"}`)

      return sendJson(res, 200, {
        ok: true,
        purchaseId: p.id,
        productId: p.productId,
        status: deliv.status || "delivered",
        alreadyGranted: granted.alreadyGranted,
        player: granted.player,
      })
    }

    // ------------------------------------------------------------------------
    // 2. OFFICIAL VATAR WEBHOOK ENDPOINT (POST /vatar-webhook)
    // Follows https://lagoslife.app/developers/docs#webhooks
    // ------------------------------------------------------------------------
    if (req.method === "POST" && pathname === "/vatar-webhook") {
      const raw = await readRawBody(req)
      const sigHeader = req.headers["x-vatar-signature"]
      if (!verifyWebhookSignature(raw, sigHeader)) {
        return sendJson(res, 401, { error: "bad_signature", message: "Invalid X-Vatar-Signature" })
      }

      let evt
      try {
        evt = JSON.parse(raw.toString("utf8"))
      } catch {
        return sendJson(res, 400, { error: "bad_request" })
      }

      const deliveryId = req.headers["x-vatar-delivery"] || evt.id
      store.checklist.webhookAnswered2xx = true
      console.log(`🔔 [VATAR WEBHOOK] event=${evt.type} deliveryId=${deliveryId} mode=${evt.mode}`)

      // Deduplicate webhook deliveries by id
      if (deliveryId && store.handledWebhooks[deliveryId]) {
        saveStore()
        return sendJson(res, 200, { ok: true, deduplicated: true })
      }
      if (deliveryId) {
        store.handledWebhooks[deliveryId] = { at: Date.now(), type: evt.type }
      }

      // "It's a nudge, not proof: check the purchase with the API before giving anything."
      if (evt.type === "purchase.paid" && evt.data?.purchaseId) {
        const p = await callVatarApi(`/purchases/${encodeURIComponent(evt.data.purchaseId)}`)
        if (p.http === 200 && p.status !== "refunded" && p.playerId && p.productId) {
          grantPurchaseToPlayer(p.playerId, p.productId, p.id)
          await callVatarApi(`/purchases/${encodeURIComponent(p.id)}/deliver`, {})
        }
      } else if (evt.type === "match.started" && evt.data?.id) {
        // Store match nonce if provided by webhook
        if (evt.data.nonce && store.sandboxMatches[evt.data.id]) {
          store.sandboxMatches[evt.data.id].nonce = evt.data.nonce
        }
      }
      saveStore()
      return sendJson(res, 200, { ok: true })
    }

    // ------------------------------------------------------------------------
    // 3. MULTIPLAYER MATCH SETTLEMENT (POST /api/match/settle)
    // Signs result with VATAR_RESULTS_SECRET (5-line HMAC-SHA256) per Spec §7
    // ------------------------------------------------------------------------
    if (req.method === "POST" && pathname === "/api/match/settle") {
      const raw = await readRawBody(req)
      const { session, matchId, myScore, opponentScore, opponentId } = JSON.parse(raw.toString("utf8") || "{}")
      const me = await callVatarApi("/session/verify", { session })
      if (me.http !== 200 || !me.playerId) {
        return sendJson(res, 403, { error: "invalid_token" })
      }

      // Fetch the match from Vatar API (or sandbox store) to get its nonce
      let matchInfo = store.sandboxMatches[matchId]
      if (!matchInfo) {
        const fetched = await callVatarApi(`/matches/${encodeURIComponent(matchId)}`)
        if (fetched.http === 200) matchInfo = fetched
      }
      if (!matchInfo) {
        return sendJson(res, 404, { error: "not_found", message: "Match not found" })
      }

      let winner = "draw"
      if (Number(myScore) > Number(opponentScore)) winner = me.playerId
      else if (Number(opponentScore) > Number(myScore)) winner = opponentId || "p_bot_rival"

      const resultPath = `/api/games/v1/matches/${matchId}/result`
      const resultBodyObj = { winner }
      const resultBodyStr = JSON.stringify(resultBodyObj)
      const ts = String(Math.floor(Date.now() / 1000))
      const sha = crypto.createHash("sha256").update(resultBodyStr).digest("hex")
      const sig =
        "v1=" +
        crypto
          .createHmac("sha256", VATAR_RESULTS_SECRET)
          .update(["POST", resultPath, ts, matchInfo.nonce || "nonce_default", sha].join("\n"))
          .digest("hex")

      const settled = await callVatarApi(`/matches/${encodeURIComponent(matchId)}/result`, resultBodyObj, {
        "X-Vatar-Timestamp": ts,
        "X-Vatar-Signature": sig,
      })

      const player = getOrCreatePlayer(me.playerId, me.name)
      player.matchesPlayed = (player.matchesPlayed || 0) + 1
      if (winner === me.playerId) {
        player.matchesWon = (player.matchesWon || 0) + 1
      }
      saveStore()

      return sendJson(res, settled.http || 200, {
        ok: settled.http === 200,
        match: settled,
        winner,
        signatureUsed: sig.slice(0, 19) + "…",
      })
    }

    // ------------------------------------------------------------------------
    // 4. PLAYER PROFILE & STATE SYNC (POST /api/player/sync)
    // Identifies player by Vatar session token + player.id (never cookies!)
    // Includes clientBackup high-water-mark merge so Render free-tier restarts
    // never wipe a player's earned Naira, unlocked kitchens, or upgrades.
    // ------------------------------------------------------------------------
    if (req.method === "POST" && pathname === "/api/player/sync") {
      const raw = await readRawBody(req)
      const body = JSON.parse(raw.toString("utf8") || "{}")
      const { session, action, payload, clientBackup } = body

      let playerId = body.playerId || "t_guest_lagos"
      let playerName = body.playerName || "Lagosian"

      if (session) {
        const verified = await callVatarApi("/session/verify", { session })
        if (verified.http === 200 && verified.playerId) {
          playerId = verified.playerId
          playerName = verified.name || playerName
        }
      }

      store.checklist.sdkInitSeen = true
      const player = getOrCreatePlayer(playerId, playerName)

      // High-water-mark recovery from browser localStorage backup if Render container restarted
      if (clientBackup && typeof clientBackup === "object") {
        const cbShifts = Math.max(0, Math.min(100000, Math.floor(Number(clientBackup.shiftsPlayed) || 0)))
        const serverWasReset = cbShifts > (player.shiftsPlayed || 0) || ((player.shiftsPlayed || 0) === 0 && Number(clientBackup.nairaEarned) > player.nairaEarned)

        if (cbShifts > (player.shiftsPlayed || 0)) player.shiftsPlayed = cbShifts
        if (Number(clientBackup.ordersServed) > (player.ordersServed || 0)) {
          player.ordersServed = Math.min(1000000, Math.floor(Number(clientBackup.ordersServed) || 0))
        }
        if (Number(clientBackup.bestScore) > (player.bestScore || 0)) {
          player.bestScore = Math.min(10000000, Math.floor(Number(clientBackup.bestScore) || 0))
        }
        if (serverWasReset) {
          if (Number(clientBackup.nairaEarned) > player.nairaEarned) {
            player.nairaEarned = Math.min(50000000, Math.floor(Number(clientBackup.nairaEarned) || 0))
          }
          if (Number(clientBackup.peppers) > player.peppers) {
            player.peppers = Math.min(500000, Math.floor(Number(clientBackup.peppers) || 0))
          }
          if (clientBackup.boosters && typeof clientBackup.boosters === "object") {
            for (const bKey of ["rushBoosts", "autoChefs", "jaraRefills"]) {
              const bVal = Math.max(0, Math.min(999, Math.floor(Number(clientBackup.boosters[bKey]) || 0)))
              if (bVal > (player.boosters[bKey] || 0)) player.boosters[bKey] = bVal
            }
          }
        }
        const validKitchens = ["yaba_suya", "shitta_amala", "ikeja_shawarma", "vi_quilox"]
        if (Array.isArray(clientBackup.unlockedKitchens)) {
          for (const kId of clientBackup.unlockedKitchens) {
            if (validKitchens.includes(kId) && !player.unlockedKitchens.includes(kId)) {
              player.unlockedKitchens.push(kId)
            }
          }
        }
        if (Array.isArray(clientBackup.ownedOneOffs)) {
          for (const prodId of clientBackup.ownedOneOffs) {
            if (PRODUCT_CATALOG[prodId] && !player.ownedOneOffs.includes(prodId)) {
              player.ownedOneOffs.push(prodId)
            }
          }
        }
        if (clientBackup.kitchenLevels && typeof clientBackup.kitchenLevels === "object") {
          for (const kId of validKitchens) {
            const srcK = clientBackup.kitchenLevels[kId]
            const dstK = player.kitchenLevels[kId]
            if (srcK && dstK) {
              for (const stat of ["grillSpeed", "grillSlots", "tipBonus", "patienceBoost"]) {
                const maxCap = stat === "grillSlots" ? 4 : 5
                const sVal = Math.max(1, Math.min(maxCap, Math.floor(Number(srcK[stat]) || 1)))
                if (sVal > (dstK[stat] || 1)) dstK[stat] = sVal
              }
            }
          }
        }
      }

      if (action === "load") {
        console.log(`👀 [PLAYER OPENED GAME] name="${player.name}" id=${playerId} referer=${req.headers.referer || "direct"}`)
      } else if (action === "record_shift") {
        console.log(`🔥 [SHIFT COMPLETED] name="${player.name}" id=${playerId} naira=${payload?.nairaEarned} score=${payload?.score}`)
      }

      if (action === "record_shift" && payload) {
        const earned = Math.max(0, Math.min(500000, Math.floor(Number(payload.nairaEarned) || 0)))
        const score = Math.max(0, Math.min(1000000, Math.floor(Number(payload.score) || 0)))
        const orders = Math.max(0, Math.min(500, Math.floor(Number(payload.ordersServed) || 0)))
        const peppersFound = Math.max(0, Math.min(200, Math.floor(Number(payload.peppersFound) || 0)))

        player.nairaEarned += earned
        player.peppers += peppersFound
        player.shiftsPlayed += 1
        player.ordersServed += orders
        if (score > player.bestScore) {
          player.bestScore = score
        }

        // Update local leaderboard mirror
        const existingIdx = store.leaderboard.findIndex((e) => e.playerId === playerId)
        if (existingIdx >= 0) {
          if (player.bestScore > store.leaderboard[existingIdx].score) {
            store.leaderboard[existingIdx].score = player.bestScore
          }
          store.leaderboard[existingIdx].name = player.name
        } else if (player.bestScore > 0) {
          store.leaderboard.push({ playerId, name: player.name, score: player.bestScore })
        }
        store.leaderboard.sort((a, b) => b.score - a.score)
        store.leaderboard = store.leaderboard.slice(0, 50)
      } else if (action === "upgrade_kitchen" && payload) {
        const { kitchenId, stat } = payload
        const k = player.kitchenLevels[kitchenId]
        if (k && typeof k[stat] === "number" && k[stat] < 5) {
          const costNaira = k[stat] * 650
          if (player.nairaEarned >= costNaira) {
            player.nairaEarned -= costNaira
            k[stat] += 1
          }
        }
      } else if (action === "unlock_kitchen" && payload) {
        const { kitchenId, costNaira, costPeppers } = payload
        if (!player.unlockedKitchens.includes(kitchenId)) {
          if (costPeppers && player.peppers >= costPeppers) {
            player.peppers -= costPeppers
            player.unlockedKitchens.push(kitchenId)
          } else if (costNaira && player.nairaEarned >= costNaira) {
            player.nairaEarned -= costNaira
            player.unlockedKitchens.push(kitchenId)
          }
        }
      } else if (action === "use_booster" && payload) {
        const { boosterKey } = payload
        if (player.boosters[boosterKey] > 0) {
          player.boosters[boosterKey] -= 1
        }
      } else if (action === "buy_booster_peppers" && payload) {
        const { boosterKey, costPeppers, qty } = payload
        if (player.peppers >= costPeppers) {
          player.peppers -= costPeppers
          player.boosters[boosterKey] = (player.boosters[boosterKey] || 0) + (qty || 1)
        }
      }

      player.updatedAt = Date.now()
      saveStore()

      // Pending undelivered sandbox purchases for this player
      const pendingPurchases = Object.values(store.sandboxPurchases)
        .filter((p) => p.playerId === playerId && p.status === "paid" && !store.deliveredPurchases[p.id])
        .map((p) => ({ purchaseId: p.id, productId: p.productId }))

      return sendJson(res, 200, {
        ok: true,
        player,
        catalog: PRODUCT_CATALOG,
        pendingPurchases,
        checklist: store.checklist,
      })
    }

    // ------------------------------------------------------------------------
    // 5. LOCAL VATAR SANDBOX SIMULATOR API (/api/sandbox/*)
    // Allows full end-to-end testing of Vatar SDK v1 (sessions, test purchases,
    // signed webhooks, leaderboards, and 1v1 staked matches) right in the browser!
    // ------------------------------------------------------------------------
    if (pathname === "/api/sandbox/init" && req.method === "POST") {
      const raw = await readRawBody(req)
      const { playerId = "t_lagos_hustler_01", name = "Tunde_Eko" } = JSON.parse(raw.toString("utf8") || "{}")
      const exp = Date.now() + 15 * 60 * 1000
      const tokenPayload = Buffer.from(
        JSON.stringify({ v: 1, playerId, name, gameId: "buka_boss_draft", exp, mode: "test" })
      ).toString("base64url")
      const session = `vtr1_sandbox.${tokenPayload}.sig_test`
      store.checklist.sdkInitSeen = true
      const player = getOrCreatePlayer(playerId, name)
      const undelivered = Object.values(store.sandboxPurchases)
        .filter((p) => p.playerId === playerId && p.status === "paid" && !store.deliveredPurchases[p.id])
        .map((p) => ({ purchaseId: p.id, productId: p.productId }))
      saveStore()
      return sendJson(res, 200, {
        player: { id: playerId, name: player.name, avatar: null },
        session,
        exp,
        mode: "test",
        undelivered,
        checklist: store.checklist,
      })
    }

    if (pathname === "/api/sandbox/purchase" && req.method === "POST") {
      const raw = await readRawBody(req)
      const { playerId = "t_lagos_hustler_01", productId, outcome = "paid" } = JSON.parse(raw.toString("utf8") || "{}")
      const product = PRODUCT_CATALOG[productId]
      if (!product) {
        return sendJson(res, 404, { error: "not_for_sale", message: "Unknown productId" })
      }
      const player = getOrCreatePlayer(playerId)
      if (product.kind === "one_off" && player.ownedOneOffs.includes(productId)) {
        return sendJson(res, 409, { error: "owned", message: "Player already owns this one-off product" })
      }
      if (outcome !== "paid") {
        return sendJson(res, 400, { error: outcome === "cancelled" ? "cancelled" : "payment_failed" })
      }
      const purchaseId = crypto.randomBytes(10).toString("hex")
      const record = {
        id: purchaseId,
        productId,
        playerId,
        amount: product.amount,
        currency: "NGN",
        status: "paid",
        createdAt: Date.now(),
        mode: "test",
      }
      store.sandboxPurchases[purchaseId] = record
      store.checklist.testPurchaseMade = true
      saveStore()
      return sendJson(res, 200, { purchaseId, productId, record })
    }

    if (pathname === "/api/sandbox/send-test-webhook" && req.method === "POST") {
      const raw = await readRawBody(req)
      const { playerId = "t_lagos_hustler_01", productId = "spices_pack_100" } = JSON.parse(raw.toString("utf8") || "{}")
      const product = PRODUCT_CATALOG[productId] || PRODUCT_CATALOG.spices_pack_100
      const purchaseId = crypto.randomBytes(10).toString("hex")
      store.sandboxPurchases[purchaseId] = {
        id: purchaseId,
        productId: product.id,
        playerId,
        amount: product.amount,
        currency: "NGN",
        status: "paid",
        createdAt: Date.now(),
        mode: "test",
      }
      store.checklist.testPurchaseMade = true
      saveStore()

      const evtId = "evt_" + crypto.randomBytes(8).toString("hex")
      const webhookPayload = JSON.stringify({
        id: evtId,
        type: "purchase.paid",
        mode: "test",
        createdAt: Date.now(),
        data: {
          purchaseId,
          productId: product.id,
          playerId,
          amount: product.amount,
          currency: "NGN",
        },
      })
      const sig =
        "sha256=" + crypto.createHmac("sha256", VATAR_WEBHOOK_SECRET).update(webhookPayload).digest("hex")

      // Call our own /vatar-webhook endpoint with the signed payload
      const whRes = await fetch(`http://127.0.0.1:${PORT}/vatar-webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Vatar-Event": "purchase.paid",
          "X-Vatar-Delivery": evtId,
          "X-Vatar-Signature": sig,
        },
        body: webhookPayload,
      })

      return sendJson(res, 200, {
        ok: whRes.ok,
        webhookStatus: whRes.status,
        deliveryId: evtId,
        purchaseId,
        productId: product.id,
        player: getOrCreatePlayer(playerId),
        checklist: store.checklist,
      })
    }

    if (pathname === "/api/sandbox/match" && req.method === "POST") {
      const raw = await readRawBody(req)
      const { action, playerId = "t_lagos_hustler_01", name = "Tunde_Eko", stake = 1000, code } = JSON.parse(
        raw.toString("utf8") || "{}"
      )
      const matchId = "m_" + crypto.randomBytes(8).toString("hex")
      const roomCode = (code || crypto.randomBytes(3).toString("hex")).toUpperCase().slice(0, 6)
      const nonce = "nonce_" + crypto.randomBytes(8).toString("hex")
      const rivalNames = ["Chinedu_Yaba", "Sisi_Eko", "Oba_Suya", "Bimpe_Surulere", "DJ_Quilox"]
      const rivalName = rivalNames[Math.floor(Math.random() * rivalNames.length)]

      const matchObj = {
        id: matchId,
        code: roomCode,
        status: "playing",
        stake: Number(stake) || 0,
        seats: 2,
        players: [
          { id: playerId, playerId, name },
          { id: "t_bot_rival", playerId: "t_bot_rival", name: rivalName },
        ],
        me: playerId,
        winner: null,
        result: null,
        nonce,
        mode: "test",
        createdAt: Date.now(),
        startedAt: Date.now(),
        endsAt: Date.now() + 60 * 1000,
      }
      store.sandboxMatches[matchId] = matchObj
      saveStore()
      return sendJson(res, 200, { ok: true, action, match: matchObj })
    }

    if (pathname === "/api/leaderboard" && req.method === "GET") {
      const playerId = url.searchParams.get("playerId") || "t_lagos_hustler_01"
      const top = store.leaderboard.slice(0, 50).map((entry, idx) => ({
        rank: idx + 1,
        name: entry.name,
        score: entry.score,
      }))
      const myIdx = store.leaderboard.findIndex((e) => e.playerId === playerId)
      const me =
        myIdx >= 0
          ? { rank: myIdx + 1, label: `#${myIdx + 1}`, score: store.leaderboard[myIdx].score }
          : store.players[playerId]?.bestScore
          ? { rank: null, label: "1,000+", score: store.players[playerId].bestScore }
          : null
      return sendJson(res, 200, { top, me })
    }

    if (pathname === "/healthz" && req.method === "GET") {
      return sendJson(res, 200, { ok: true, status: "healthy", service: "buka-boss-lagos-life" })
    }

    if (pathname === "/api/dev-checklist" && req.method === "GET") {
      return sendJson(res, 200, {
        checklist: store.checklist,
        isRealVatarKey: IS_REAL_VATAR_KEY,
        mode: IS_LIVE_KEY ? "live" : "test",
        catalogCount: Object.keys(PRODUCT_CATALOG).length,
      })
    }

    // ------------------------------------------------------------------------
    // 6. STATIC FILES (public/)
    // ------------------------------------------------------------------------
    const publicDir = path.join(__dirname, "public")
    let relPath = pathname === "/" ? "/index.html" : pathname
    if (relPath === "/sandbox") relPath = "/sandbox.html"
    const safePath = path.normalize(relPath).replace(/^(\.\.(\/|\\|$))+/, "")
    const filePath = path.join(publicDir, safePath)

    if (filePath.startsWith(publicDir) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase()
      const contentType = MIME_TYPES[ext] || "application/octet-stream"
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": ext === ".png" ? "public, max-age=3600" : "no-cache",
      })
      fs.createReadStream(filePath).pipe(res)
      return
    }

    sendJson(res, 404, { error: "not_found", message: "Route not found" })
  } catch (err) {
    console.error("Server error:", err)
    sendJson(res, 500, { error: "error", message: "Internal server error" })
  }
})

server.listen(PORT, HOST, () => {
  console.log(`🔥 Buka Boss: Lagos Street Kitchen server listening on http://${HOST}:${PORT}`)
})
