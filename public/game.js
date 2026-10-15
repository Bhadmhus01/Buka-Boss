// game.js · Buka Boss: Lagos Street Kitchen & 1v1 Cook-Off
// Built for Lagos Life · Vatar Games SDK v1 (https://lagoslife.app/developers/docs)

// ============================================================================
// 1. LAGOS KITCHENS, MENUS & CUSTOMERS DATA
// ============================================================================
const KITCHENS = {
  yaba_suya: {
    id: "yaba_suya",
    name: "Yaba Night Junction",
    emoji: "🔥",
    badge: "📍 Yaba Night Junction",
    shortDesc: "Mai Suya open flame grill, spicy Yaji, Masa & cold Zobo.",
    priceMult: 1.0,
    unlockNaira: 0,
    unlockPeppers: 0,
    mains: [
      { id: "beef_suya", name: "Beef Suya", emoji: "🥩", basePrice: 180 },
      { id: "chicken_suya", name: "Chicken Suya", emoji: "🍗", basePrice: 200 },
    ],
    sides: [
      { id: "yaji_spice", name: "Yaji Pepper", emoji: "🌶️", price: 60 },
      { id: "sliced_onions", name: "Onions & Cabbage", emoji: "🧅", price: 50 },
      { id: "masa_cake", name: "Hot Masa", emoji: "🥞", price: 80 },
      { id: "chilled_zobo", name: "Chilled Zobo", emoji: "🥤", price: 90 },
    ],
  },
  shitta_amala: {
    id: "shitta_amala",
    name: "Amala Shitta Spot",
    emoji: "🍲",
    badge: "📍 Amala Shitta, Surulere",
    shortDesc: "Steaming Amala, Abula (Gbegiri + Ewedu) & Assorted Meat.",
    priceMult: 1.45,
    unlockNaira: 3500,
    unlockPeppers: 350,
    mains: [
      { id: "hot_amala", name: "Hot Amala", emoji: "🤎", basePrice: 240 },
      { id: "assorted_meat", name: "Bokoto & Shaki", emoji: "🍖", basePrice: 260 },
    ],
    sides: [
      { id: "ewedu_soup", name: "Ewedu Soup", emoji: "🥬", price: 80 },
      { id: "gbegiri_soup", name: "Gbegiri (Abula)", emoji: "🟡", price: 90 },
      { id: "sweet_dodo", name: "Fried Dodo", emoji: "🍌", price: 85 },
      { id: "eva_water", name: "Cold Water", emoji: "💧", price: 60 },
    ],
  },
  ikeja_shawarma: {
    id: "ikeja_shawarma",
    name: "Computer Village Grill",
    emoji: "🌯",
    badge: "📍 Computer Village, Ikeja",
    shortDesc: "Loaded double-sausage Shawarma, Smoky Jollof & Chapman.",
    priceMult: 1.9,
    unlockNaira: 8000,
    unlockPeppers: 750,
    mains: [
      { id: "loaded_shawarma", name: "Shawarma Wrap", emoji: "🌯", basePrice: 320 },
      { id: "smoky_jollof", name: "Party Jollof", emoji: "🍛", basePrice: 300 },
    ],
    sides: [
      { id: "double_sausage", name: "Double Hotdog", emoji: "🌭", price: 110 },
      { id: "puff_puff", name: "Hot Puff-Puff", emoji: "🧆", price: 90 },
      { id: "peppered_gizzard", name: "Gizzard Skewer", emoji: "🍢", price: 130 },
      { id: "ikj_chapman", name: "Fruity Chapman", emoji: "🍹", price: 120 },
    ],
  },
  vi_quilox: {
    id: "vi_quilox",
    name: "Quilox & VI VIP Rooftop",
    emoji: "🪩",
    badge: "📍 Victoria Island VIP Rooftop",
    shortDesc: "Late-night Croaker Fish, Spicy Asun & VIP Mocktails for Odogwus.",
    priceMult: 2.6,
    unlockNaira: 18000,
    unlockPeppers: 1400,
    mains: [
      { id: "croaker_fish", name: "Grilled Croaker", emoji: "🐟", basePrice: 450 },
      { id: "spicy_asun", name: "Peppered Asun", emoji: "🔥", basePrice: 420 },
    ],
    sides: [
      { id: "peppered_snail", name: "Jumbo Snail", emoji: "🐚", price: 180 },
      { id: "gold_jollof", name: "Basmati Jollof", emoji: "✨", price: 160 },
      { id: "plantain_cubes", name: "Gizdodo Cubes", emoji: "🍌", price: 140 },
      { id: "vip_mocktail", name: "Quilox Rosé Zobo", emoji: "🥂", price: 200 },
    ],
  },
}

const CUSTOMER_ARCHETYPES = [
  { name: "Danfo Driver", avatar: "🚐", line: "Oga hurry before LASTMA tow my bus!" },
  { name: "Yaba Tech Bro", avatar: "💻", line: "Abeg add extra Yaji, I dey deploy!" },
  { name: "Owambe Aunty", avatar: "👩🏾‍🦱", line: "Make the food hot well-well o!" },
  { name: "Island Odogwu", avatar: "🕶️", line: "Keep the change if you serve am fast!" },
  { name: "UNILAG Babe", avatar: "🤳🏾", line: "Boss, cut small jara for my TikTok!" },
  { name: "Lekki Realtor", avatar: "👔", line: "My client dey wait for Banana Island!" },
  { name: "Mama Bisi", avatar: "💇🏾‍♀️", line: "My salon girls dey hungry o!" },
  { name: "Afrobeats DJ", avatar: "🎧", line: "Quick bite before Quilox set starts!" },
]

const LAGOS_CITY_EVENTS = [
  {
    id: "felabration",
    icon: "🎷",
    title: "Felabration Week",
    timer: "Ends in 3d 14h",
    desc: "Lagos celebrates Fela all week! Crowds heading to Afrika Shrine pay +20% Naira fares.",
    pill: "1.2× FARES",
    nairaMult: 1.2,
    extraPeppers: 0,
  },
  {
    id: "super_eagles",
    icon: "⚽",
    title: "Viewing Centre Match Night",
    timer: "Live Tonight",
    desc: "Viewing Centres are packed across Lagos! All Suya, Shawarma & drinks earn +25% tips.",
    pill: "1.25× TIPS",
    nairaMult: 1.25,
    extraPeppers: 0,
  },
  {
    id: "gov_food_policy",
    icon: "🏛️",
    title: "Gov. Food Policy Subsidy",
    timer: "Active Term",
    desc: "Lagos State 'Food First' policy is live! +15% Naira fares & +2🌶️ Peppers on fast serves.",
    pill: "+15% & +2🌶️",
    nairaMult: 1.15,
    extraPeppers: 2,
  },
]

const WAHALA_ENCOUNTERS = [
  {
    id: "area_boys",
    avatar: "🕶️",
    title: "Area Boys at Your Stall!",
    line: '"Chairman! Your Suya aroma reach bus stop o. Drop small pure water money make we hype your spot!"',
    choices: [
      { label: "💸 Settle ₦150", kind: "settle_150", primary: true },
      { label: "🥩 Dash Suya", kind: "dash_food" },
      { label: "🗣️ No Shishi!", kind: "plead_or_odogwu" },
    ],
  },
  {
    id: "inspector",
    avatar: "📋",
    title: "Lagos Health Inspector!",
    line: '"Good evening Chef! Show your clean kitchen permit or package one hot Jollof inspection pack!"',
    choices: [
      { label: "📄 Show Papers", kind: "show_papers", primary: true },
      { label: "🍛 Jara Pack (₦100)", kind: "jara_100" },
      { label: "🙏🏾 Plead Well", kind: "plead_or_odogwu" },
    ],
  },
  {
    id: "tiktok_foodie",
    avatar: "🤳🏾",
    title: "Viral TikTok Food Blogger!",
    line: '"Wait o! Is this the famous Buka Boss spot?! Let me film a VIP tasting tray for 100k Lagosians!"',
    choices: [
      { label: "✨ VIP Tray (₦120)", kind: "viral_fever", primary: true },
      { label: "🌶️ Spicy Sample", kind: "spicy_sample" },
      { label: "👋🏾 Too Busy", kind: "quick_tip" },
    ],
  },
]

// ============================================================================
// 2. WEB AUDIO SYNTHESIZER (Review Checklist #4: Starts ONLY after first tap,
//    pauses immediately on Vatar.onPause, resumes on Vatar.onResume)
// ============================================================================
class SoundEngine {
  constructor() {
    this.ctx = null
    this.unlocked = false
    this.muted = false
    this.pausedByPlatform = false
  }

  unlock() {
    if (this.unlocked) return
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
    if (this.ctx.state === "suspended" && !this.pausedByPlatform) {
      this.ctx.resume().catch(() => {})
    }
    this.unlocked = true
  }

  setPlatformPaused(paused) {
    this.pausedByPlatform = paused
    if (!this.ctx) return
    if (paused) {
      this.ctx.suspend().catch(() => {})
    } else if (!this.muted) {
      this.ctx.resume().catch(() => {})
    }
  }

  toggleMute() {
    this.muted = !this.muted
    if (this.ctx) {
      if (this.muted) this.ctx.suspend().catch(() => {})
      else if (!this.pausedByPlatform) this.ctx.resume().catch(() => {})
    }
    return this.muted
  }

  playTone(freq = 440, duration = 0.09, type = "triangle", gainVal = 0.08, slideTo = null) {
    if (!this.unlocked || this.muted || this.pausedByPlatform || !this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, now)
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration)
      }
      gain.gain.setValueAtTime(gainVal, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + duration)
    } catch {}
  }

  tap() {
    this.playTone(520, 0.05, "sine", 0.06, 660)
  }

  sizzle() {
    this.playTone(280, 0.08, "sawtooth", 0.05, 420)
  }

  readyDing() {
    this.playTone(880, 0.1, "triangle", 0.08, 1174)
  }

  cashServe() {
    this.playTone(587, 0.08, "triangle", 0.09)
    setTimeout(() => this.playTone(880, 0.14, "triangle", 0.1, 1174), 65)
  }

  nepaDown() {
    this.playTone(300, 0.28, "sawtooth", 0.1, 95)
  }

  upNepa() {
    this.playTone(440, 0.08, "triangle", 0.09)
    setTimeout(() => this.playTone(659, 0.09, "triangle", 0.09), 70)
    setTimeout(() => this.playTone(880, 0.18, "triangle", 0.11), 140)
  }

  error() {
    this.playTone(190, 0.14, "sawtooth", 0.07, 140)
  }
}

const sfx = new SoundEngine()
window.addEventListener("pointerdown", () => sfx.unlock(), { once: true })

// ============================================================================
// 3. VATAR GAMES SDK v1 BRIDGE (Supports Real Framed SDK + Local Sandbox Mode)
// ============================================================================
class VatarSdkBridge {
  constructor() {
    this.isRealFrame = false
    this.mode = "test"
    this.player = { id: "t_lagos_hustler_01", name: "Tunde_Eko", avatar: null }
    this.currentSession = null
    this.lastScoreSubmitAt = 0
    this.purchaseListeners = []
    this.pauseListeners = []
    this.resumeListeners = []
    this.matchListeners = []
    this.pendingSheetResolver = null
  }

  async init() {
    // 1. Try real window.Vatar.init() first when framed inside lagoslife.app or /sandbox
    if (window.Vatar && window.self !== window.top) {
      try {
        const res = await window.Vatar.init()
        this.isRealFrame = true
        this.player = res.player
        this.currentSession = res.session
        this.mode = res.mode || "live"

        // Wire native SDK listeners
        window.Vatar.onPurchase((p) => this.purchaseListeners.forEach((fn) => fn(p)))
        window.Vatar.onPause(() => this.pauseListeners.forEach((fn) => fn()))
        window.Vatar.onResume(() => this.resumeListeners.forEach((fn) => fn()))
        if (window.Vatar.match?.onUpdate) {
          window.Vatar.match.onUpdate((m) => this.matchListeners.forEach((fn) => fn(m)))
        }
        return res
      } catch (err) {
        // Fallback to local sandbox mode if parent frame is Arena preview rather than lagoslife.app
        console.log("Not inside lagoslife.app parent frame (" + (err.code || err.message) + "), activating Local Vatar Sandbox.")
      }
    }

    // 2. Local Vatar Sandbox initialization
    const r = await fetch("/api/sandbox/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: this.player.id, name: this.player.name }),
    })
    const data = await r.json()
    this.player = data.player
    this.currentSession = data.session
    this.mode = data.mode || "test"
    this._sandboxUndelivered = data.undelivered || []
    return { player: this.player, session: this.currentSession, mode: this.mode }
  }

  async session() {
    if (this.isRealFrame && window.Vatar) {
      return await window.Vatar.session()
    }
    const r = await fetch("/api/sandbox/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: this.player.id, name: this.player.name }),
    })
    const data = await r.json()
    this.currentSession = data.session
    return { session: data.session, exp: data.exp }
  }

  async purchases() {
    if (this.isRealFrame && window.Vatar) {
      return await window.Vatar.purchases()
    }
    return this._sandboxUndelivered || []
  }

  async purchase(productId, productMeta = null) {
    if (this.isRealFrame && window.Vatar) {
      return await window.Vatar.purchase(productId)
    }
    // In Local Sandbox mode, open the simulated Lagos Life Pay Sheet modal (and pause the game just like Vatar does!)
    this.pauseListeners.forEach((fn) => fn())
    return new Promise((resolve, reject) => {
      this.pendingSheetResolver = { productId, productMeta, resolve, reject }
      openSandboxPaySheet(productId, productMeta)
    })
  }

  async submitScore(score) {
    const cleanScore = Math.floor(Number(score) || 0)
    if (cleanScore <= 0) return { best: 0, accepted: false }
    const now = Date.now()
    if (now - this.lastScoreSubmitAt < 20000) {
      const e = new Error("Vatar: too_soon")
      e.code = "too_soon"
      throw e
    }
    this.lastScoreSubmitAt = now
    if (this.isRealFrame && window.Vatar) {
      return await window.Vatar.submitScore(cleanScore)
    }
    return { best: cleanScore, accepted: true }
  }

  async leaderboard() {
    if (this.isRealFrame && window.Vatar) {
      try {
        return await window.Vatar.leaderboard()
      } catch {}
    }
    const r = await fetch(`/api/leaderboard?playerId=${encodeURIComponent(this.player.id)}`)
    return await r.json()
  }

  async matchQuick(stake = 0) {
    if (this.isRealFrame && window.Vatar?.match) {
      try {
        return await window.Vatar.match.quick({ stake })
      } catch (e) {
        // Fallback if world hasn't turned live matches on yet so sandbox can still be tested
        if (e.code !== "not_framed") console.warn("Vatar.match.quick note:", e.code)
      }
    }
    const r = await fetch("/api/sandbox/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "quick", playerId: this.player.id, name: this.player.name, stake }),
    })
    const d = await r.json()
    return d.match
  }

  async matchCreate(stake = 0, seats = 2) {
    if (this.isRealFrame && window.Vatar?.match) {
      try {
        return await window.Vatar.match.create({ stake, seats })
      } catch {}
    }
    const r = await fetch("/api/sandbox/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", playerId: this.player.id, name: this.player.name, stake }),
    })
    const d = await r.json()
    return d.match
  }

  async matchJoin(code) {
    if (this.isRealFrame && window.Vatar?.match) {
      try {
        return await window.Vatar.match.join(code)
      } catch {}
    }
    const r = await fetch("/api/sandbox/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "join", playerId: this.player.id, name: this.player.name, code }),
    })
    const d = await r.json()
    return d.match
  }

  onPurchase(fn) {
    this.purchaseListeners.push(fn)
  }
  onPause(fn) {
    this.pauseListeners.push(fn)
  }
  onResume(fn) {
    this.resumeListeners.push(fn)
  }
  onMatchUpdate(fn) {
    this.matchListeners.push(fn)
  }
}

const VatarBridge = new VatarSdkBridge()

// ============================================================================
// 4. GAME STATE & SERVER SYNC
// ============================================================================
const state = {
  playerProfile: {
    playerId: "t_lagos_hustler_01",
    name: "Tunde_Eko",
    nairaEarned: 1500,
    peppers: 150,
    bestScore: 0,
    unlockedKitchens: ["yaba_suya"],
    kitchenLevels: {
      yaba_suya: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
      shitta_amala: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
      ikeja_shawarma: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
      vi_quilox: { grillSpeed: 1, grillSlots: 3, tipBonus: 1, patienceBoost: 1 },
    },
    boosters: { rushBoosts: 2, autoChefs: 1, jaraRefills: 2 },
    ownedOneOffs: [],
  },
  catalog: {},
  checklist: {},
  selectedKitchenId: "yaba_suya",
  selectedStake: 0,
  pendingRoomMatch: null,
  activeEventIdx: 0,

  // Active Shift State
  shift: {
    running: false,
    paused: false,
    timeLeft: 75,
    naira: 0,
    score: 0,
    ordersServed: 0,
    peppersFound: 0,
    combo: 0,
    feverTimeLeft: 0,
    autoChefTimeLeft: 0,
    nepaBlackout: false,
    genCranks: 0,
    nextNepaIn: 20,
    wahalaTriggered: false,
    activeWahala: null,
    grills: [],
    tray: [],
    customers: [null, null, null],
    nextCustomerSpawnIn: 0.5,
    match: null, // Non-null if 1v1 Cook-Off
    rivalScore: 0,
  },
}

const $ = (id) => document.getElementById(id)

function showToast(msg) {
  const container = $("toast-container")
  if (!container) return
  const el = document.createElement("div")
  el.className = "toast"
  el.textContent = msg
  container.appendChild(el)
  setTimeout(() => el.remove(), 3100)
}

function logInspector(msg) {
  const box = $("inspector-log")
  if (!box) return
  const time = new Date().toLocaleTimeString([], { hour12: false })
  box.textContent = `[${time}] ${msg}`
}

// Claim a Vatar purchase with our backend server (Spec §3 & §8: POST /claim)
async function claimPurchase(p) {
  try {
    logInspector(`Verifying purchase ${p.purchaseId} (${p.productId}) with server /claim…`)
    const { session } = await VatarBridge.session()
    const r = await fetch("/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session, purchaseId: p.purchaseId }),
    })
    const data = await r.json()
    if (r.ok && data.ok) {
      if (data.player) state.playerProfile = data.player
      sfx.upNepa()
      showToast(`🎉 Delivered: ${state.catalog[p.productId]?.name || p.productId}!`)
      logInspector(`✅ Purchase ${p.purchaseId} verified & marked delivered!`)
      await refreshChecklist()
      renderAllUI()
    } else {
      showToast(`⚠️ Could not verify purchase: ${data.message || data.error}`)
    }
  } catch (err) {
    console.error("Claim error:", err)
  }
}

async function syncWithServer(action = "load", payload = {}) {
  try {
    const { session } = await VatarBridge.session()
    const r = await fetch("/api/player/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session,
        playerId: VatarBridge.player.id,
        playerName: VatarBridge.player.name,
        action,
        payload,
      }),
    })
    const data = await r.json()
    if (data.ok) {
      state.playerProfile = data.player
      state.catalog = data.catalog || state.catalog
      state.checklist = data.checklist || state.checklist
      renderAllUI()
      renderChecklistUI()
    }
    return data
  } catch (e) {
    console.error("Sync failed:", e)
    return null
  }
}

async function refreshChecklist() {
  try {
    const r = await fetch("/api/dev-checklist")
    const d = await r.json()
    if (d.checklist) {
      state.checklist = d.checklist
      renderChecklistUI()
    }
  } catch {}
}

// ============================================================================
// 5. UI RENDERING (HUD, KITCHENS, UPGRADES, SHOP, LEADERBOARD, CHECKLIST)
// ============================================================================
function hasPerk(productId) {
  return state.playerProfile.ownedOneOffs?.includes(productId)
}

function renderAllUI() {
  const p = state.playerProfile
  $("player-name").textContent = p.name || "Lagosian"
  const isDevUrl = new URLSearchParams(location.search).get("dev") === "1"
  $("sdk-mode-badge").textContent = VatarBridge.isRealFrame
    ? "LAGOS CHEF"
    : isDevUrl
    ? "VATAR SANDBOX"
    : "LAGOS CHEF"
  const devBtn = $("btn-sandbox-drawer")
  const devPanel = $("dev-inspector")
  if (devBtn) devBtn.classList.toggle("hidden", !isDevUrl)
  if (devPanel && !isDevUrl) devPanel.classList.add("hidden")
  if (VatarBridge.player.avatar) {
    $("player-avatar").innerHTML = `<img src="${VatarBridge.player.avatar}" alt="Avatar" />`
  }

  $("hud-naira").textContent = Math.floor(p.nairaEarned || 0).toLocaleString("en-NG")
  $("hud-peppers").textContent = Math.floor(p.peppers || 0).toLocaleString("en-NG")
  $("home-best-score").textContent = Math.floor(p.bestScore || 0).toLocaleString("en-NG")

  const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
  const ev = LAGOS_CITY_EVENTS[state.activeEventIdx % LAGOS_CITY_EVENTS.length]
  if ($("ev-icon")) {
    $("ev-icon").textContent = ev.icon
    $("ev-title").textContent = ev.title
    $("ev-timer").textContent = ev.timer
    $("ev-desc").textContent = ev.desc
    $("ev-mult-pill").textContent = ev.pill
  }
  $("active-kitchen-badge").textContent = k.badge
  $("start-shift-sub").textContent = `${k.name} · ${k.priceMult}× + ${ev.pill}`
  $("upgrade-kitchen-name").textContent = k.name

  // Perks strip
  const tipsOn = hasPerk("double_tips_300")
  const solarOn = hasPerk("solar_inverter_500")
  const odogwuOn = hasPerk("golden_suya_pass_1500")

  const elTips = $("perk-tag-tips")
  elTips.textContent = `💰 2× Tips: ${tipsOn ? "ACTIVE" : "Off"}`
  elTips.classList.toggle("locked", !tipsOn)

  const elSolar = $("perk-tag-solar")
  elSolar.textContent = `☀️ Solar Inverter: ${solarOn ? "ACTIVE" : "Off"}`
  elSolar.classList.toggle("locked", !solarOn)

  const elOdogwu = $("perk-tag-odogwu")
  elOdogwu.textContent = `👑 Odogwu Pass: ${odogwuOn ? "ACTIVE" : "Off"}`
  elOdogwu.classList.toggle("locked", !odogwuOn)

  renderKitchenCards()
  renderUpgrades()
  renderShop()
  renderBoostersBar()
}

function renderKitchenCards() {
  const container = $("kitchen-list")
  if (!container) return
  container.innerHTML = ""
  const unlocked = state.playerProfile.unlockedKitchens || ["yaba_suya"]

  Object.values(KITCHENS).forEach((k) => {
    const isUnlocked = unlocked.includes(k.id) || hasPerk("golden_suya_pass_1500")
    const isSelected = state.selectedKitchenId === k.id
    const card = document.createElement("div")
    card.className = `kitchen-card ${isSelected ? "selected" : ""} ${!isUnlocked ? "locked" : ""}`
    card.innerHTML = `
      <div class="k-top">
        <span class="k-emoji">${k.emoji}</span>
        <span class="k-mult">${k.priceMult}× Pay</span>
      </div>
      <div class="k-name">${k.name}</div>
      <div class="k-desc">${k.shortDesc}</div>
      ${
        isUnlocked
          ? `<button class="k-action-btn select">${isSelected ? "✓ Active Spot" : "Select Kitchen"}</button>`
          : `<button class="k-action-btn unlock">Unlock ₦${k.unlockNaira.toLocaleString()} or 🌶️${k.unlockPeppers}</button>`
      }
    `
    card.onclick = async () => {
      sfx.tap()
      if (isUnlocked) {
        state.selectedKitchenId = k.id
        renderAllUI()
      } else {
        if (state.playerProfile.nairaEarned >= k.unlockNaira) {
          await syncWithServer("unlock_kitchen", { kitchenId: k.id, costNaira: k.unlockNaira })
          state.selectedKitchenId = k.id
          sfx.upNepa()
          showToast(`🔓 Unlocked ${k.name}!`)
          renderAllUI()
        } else if (state.playerProfile.peppers >= k.unlockPeppers) {
          await syncWithServer("unlock_kitchen", { kitchenId: k.id, costPeppers: k.unlockPeppers })
          state.selectedKitchenId = k.id
          sfx.upNepa()
          showToast(`🔓 Unlocked ${k.name} with Gold Peppers!`)
          renderAllUI()
        } else {
          showToast(`Need ₦${k.unlockNaira.toLocaleString()} or 🌶️${k.unlockPeppers} (or Odogwu Pass in VIP Store)!`)
        }
      }
    }
    container.appendChild(card)
  })
}

function renderUpgrades() {
  const grid = $("upgrade-grid")
  if (!grid) return
  grid.innerHTML = ""
  const levels = state.playerProfile.kitchenLevels?.[state.selectedKitchenId] || {
    grillSpeed: 1,
    grillSlots: 3,
    tipBonus: 1,
    patienceBoost: 1,
  }

  const items = [
    { key: "grillSpeed", title: "🔥 Flame Burners", desc: "+20% faster cooking speed per level" },
    { key: "grillSlots", title: "🍳 Extra Grill Slot", desc: "Cook up to 4 dishes simultaneously", max: 4 },
    { key: "tipBonus", title: "🌶️ Special Yaji Mix", desc: "+15% Naira value on every dish" },
    { key: "patienceBoost", title: "📻 Naija Radio Vibes", desc: "Customers wait +20% longer" },
  ]

  items.forEach((it) => {
    const lvl = levels[it.key] || 1
    const maxLvl = it.max || 5
    const cost = lvl * 650
    const isMax = lvl >= maxLvl
    const canAfford = state.playerProfile.nairaEarned >= cost && !isMax

    const card = document.createElement("div")
    card.className = "upgrade-card"
    card.innerHTML = `
      <div class="up-top">
        <span>${it.title}</span>
        <span class="up-lvl">Lv.${lvl}/${maxLvl}</span>
      </div>
      <div class="up-desc">${it.desc}</div>
      <button class="up-btn" ${!canAfford ? "disabled" : ""}>
        ${isMax ? "MAX LEVEL" : `Upgrade · ₦${cost.toLocaleString()}`}
      </button>
    `
    card.querySelector("button").onclick = async () => {
      if (!canAfford) return
      sfx.cashServe()
      await syncWithServer("upgrade_kitchen", { kitchenId: state.selectedKitchenId, stat: it.key })
      showToast(`⚡ Upgraded ${it.title}!`)
    }
    grid.appendChild(card)
  })
}

function renderShop() {
  const oneOffContainer = $("shop-oneoffs")
  const consContainer = $("shop-consumables")
  if (!oneOffContainer || !consContainer) return
  oneOffContainer.innerHTML = ""
  consContainer.innerHTML = ""

  const products = Object.values(state.catalog)
  products.forEach((prod) => {
    const isOwned = prod.kind === "one_off" && hasPerk(prod.id)
    const row = document.createElement("div")
    row.className = `shop-item ${isOwned ? "owned" : ""}`
    row.innerHTML = `
      <div class="shop-item-info">
        <div class="shop-item-title">
          <span>${prod.kind === "one_off" ? "👑" : "🌶️"} ${prod.name}</span>
        </div>
        <div class="shop-item-desc">${prod.desc}</div>
      </div>
      <button class="shop-buy-btn ${isOwned ? "owned" : ""}" ${isOwned ? "disabled" : ""}>
        ${isOwned ? "✓ OWNED" : `₦${prod.amount.toLocaleString()}`}
      </button>
    `
    row.querySelector("button").onclick = async () => {
      if (isOwned) return
      sfx.tap()
      try {
        const res = await VatarBridge.purchase(prod.id, prod)
        await claimPurchase(res)
      } catch (err) {
        if (err.code === "cancelled") {
          showToast("Purchase cancelled.")
        } else if (err.code === "owned") {
          showToast("You already own this permanent upgrade!")
        } else {
          showToast(`Payment did not complete (${err.code || "error"}).`)
        }
      }
    }
    if (prod.kind === "one_off") oneOffContainer.appendChild(row)
    else consContainer.appendChild(row)
  })
}

async function renderLeaderboard() {
  const list = $("leaderboard-list")
  if (!list) return
  const data = await VatarBridge.leaderboard()
  const top = data.top || []
  const me = data.me

  $("my-rank-label").textContent = me ? me.label : "Unranked"
  $("my-rank-score").textContent = me ? me.score.toLocaleString("en-NG") : state.playerProfile.bestScore.toLocaleString("en-NG")

  list.innerHTML = ""
  top.forEach((row) => {
    const div = document.createElement("div")
    div.className = `rank-row ${row.rank <= 3 ? "top-3" : ""}`
    const medal = row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : `#${row.rank}`
    div.innerHTML = `
      <span class="rank-num">${medal}</span>
      <span class="rank-name">${row.name}</span>
      <span class="rank-score">${Number(row.score).toLocaleString("en-NG")} pts</span>
    `
    list.appendChild(div)
  })
}

function renderChecklistUI() {
  const c = state.checklist || {}
  const map = [
    ["chk-init", c.sdkInitSeen],
    ["chk-buy", c.testPurchaseMade],
    ["chk-verify", c.purchaseVerifiedByServer],
    ["chk-deliver", c.purchaseMarkedDelivered],
    ["chk-webhook", c.webhookAnswered2xx],
    ["chk-match", c.matchCreatedJoinedSettled],
  ]
  map.forEach(([id, ok]) => {
    const el = $(id)
    if (el) {
      el.querySelector(".chk-box").textContent = ok ? "✅" : "⬜"
    }
  })
}

// ============================================================================
// 6. CORE SHIFT GAMEPLAY ENGINE (Cooking, Plating, Serving, NEPA, Fever, 1v1)
// ============================================================================
function switchScreen(screenId) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"))
  const target = $(screenId)
  if (target) target.classList.add("active")

  document.querySelectorAll(".nav-tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.screen === screenId)
  })

  if (screenId === "screen-rank") {
    renderLeaderboard()
  }
}

function startShift(matchObj = null) {
  sfx.unlock()
  sfx.upNepa()

  const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
  const kLevels = state.playerProfile.kitchenLevels?.[k.id] || {
    grillSpeed: 1,
    grillSlots: 3,
    tipBonus: 1,
    patienceBoost: 1,
  }
  const slotCount = hasPerk("golden_suya_pass_1500") ? 4 : Math.min(4, kLevels.grillSlots || 3)

  state.shift = {
    running: true,
    paused: false,
    timeLeft: matchObj ? 60 : 75,
    naira: 0,
    score: 0,
    ordersServed: 0,
    peppersFound: 0,
    combo: 0,
    feverTimeLeft: 0,
    autoChefTimeLeft: 0,
    nepaBlackout: false,
    genCranks: 0,
    nextNepaIn: hasPerk("solar_inverter_500") ? 999 : 18,
    wahalaTriggered: false,
    activeWahala: null,
    grills: Array.from({ length: slotCount }, () => ({
      state: "empty", // empty | cooking | cooked | burnt
      item: null,
      progress: 0,
      burnProgress: 0,
    })),
    tray: [],
    customers: [null, null, null],
    nextCustomerSpawnIn: 0.2,
    match: matchObj,
    rivalScore: 0,
  }

  // Setup 1v1 banner if in multiplayer match
  const matchBar = $("match-live-bar")
  if (matchObj) {
    matchBar.classList.remove("hidden")
    const rival = matchObj.players?.find((p) => p.id !== VatarBridge.player.id) || { name: "Rival Chef" }
    $("match-my-name").textContent = state.playerProfile.name
    $("match-rival-name").textContent = rival.name
    const pot = (matchObj.stake || 0) * 2
    $("match-stake-label").textContent = pot > 0 ? `POT ₦${Math.floor(pot * 0.95).toLocaleString()}` : "FRIENDLY 1v1"
  } else {
    matchBar.classList.add("hidden")
  }

  switchScreen("screen-play")
  buildPrepDeckUI()
  spawnCustomer()
  spawnCustomer()
  renderShiftFrame()
}

function buildPrepDeckUI() {
  const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
  const mainsBox = $("prep-mains")
  const sidesBox = $("prep-sides")
  mainsBox.innerHTML = ""
  sidesBox.innerHTML = ""

  k.mains.forEach((m) => {
    const btn = document.createElement("button")
    btn.className = "prep-btn main-dish"
    btn.innerHTML = `
      <span class="p-emoji">${m.emoji}</span>
      <div>
        <div class="p-label">Cook ${m.name}</div>
        <div class="p-sub">Tap to load Grill</div>
      </div>
    `
    btn.onclick = () => putMainOnGrill(m)
    mainsBox.appendChild(btn)
  })

  k.sides.forEach((s) => {
    const btn = document.createElement("button")
    btn.className = "prep-btn"
    btn.innerHTML = `
      <span class="p-emoji">${s.emoji}</span>
      <span class="p-label">${s.name}</span>
    `
    btn.onclick = () => addItemToTray(s)
    sidesBox.appendChild(btn)
  })
}

function putMainOnGrill(mainItem) {
  if (!state.shift.running || state.shift.paused) return
  const emptySlot = state.shift.grills.find((g) => g.state === "empty")
  if (!emptySlot) {
    sfx.error()
    showToast("All grill slots are full! Tap cooked food to plate it.")
    return
  }
  sfx.sizzle()
  emptySlot.state = "cooking"
  emptySlot.item = mainItem
  emptySlot.progress = 0
  emptySlot.burnProgress = 0
  renderShiftFrame()
}

function handleGrillSlotTap(idx) {
  if (!state.shift.running || state.shift.paused) return
  const g = state.shift.grills[idx]
  if (!g) return

  if (g.state === "cooked") {
    if (state.shift.tray.length >= 5) {
      sfx.error()
      showToast("Serving tray is full! Serve or clear tray.")
      return
    }
    sfx.tap()
    state.shift.tray.push(g.item)
    g.state = "empty"
    g.item = null
    g.progress = 0
    g.burnProgress = 0
    renderShiftFrame()
  } else if (g.state === "burnt") {
    sfx.tap()
    g.state = "empty"
    g.item = null
    g.progress = 0
    g.burnProgress = 0
    renderShiftFrame()
  }
}

function addItemToTray(item) {
  if (!state.shift.running || state.shift.paused) return
  if (state.shift.tray.length >= 5) {
    sfx.error()
    showToast("Tray has 5 items max! Serve or clear tray.")
    return
  }
  sfx.tap()
  state.shift.tray.push(item)
  renderShiftFrame()
}

// Smart One-Tap Assist when player taps an ingredient chip inside a customer's order!
function smartIngredientAssist(itemId) {
  if (!state.shift.running || state.shift.paused) return
  const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
  const mainItem = k.mains.find((m) => m.id === itemId)
  if (mainItem) {
    // If one is already cooked on the grill, plate it immediately; otherwise start cooking it!
    const cookedIdx = state.shift.grills.findIndex((g) => g.state === "cooked" && g.item?.id === itemId)
    if (cookedIdx >= 0) {
      handleGrillSlotTap(cookedIdx)
    } else {
      putMainOnGrill(mainItem)
    }
    return
  }
  const sideItem = k.sides.find((s) => s.id === itemId)
  if (sideItem) {
    addItemToTray(sideItem)
  }
}

function spawnCustomer() {
  const emptyIdx = state.shift.customers.findIndex((c) => c === null)
  if (emptyIdx === -1) return

  const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
  const kLevels = state.playerProfile.kitchenLevels?.[k.id] || { patienceBoost: 1 }
  const arch = CUSTOMER_ARCHETYPES[Math.floor(Math.random() * CUSTOMER_ARCHETYPES.length)]

  // Build order: 1 main dish + 1 or 2 sides
  const main = k.mains[Math.floor(Math.random() * k.mains.length)]
  const sideCount = Math.random() < 0.65 ? 2 : 1
  const shuffledSides = [...k.sides].sort(() => Math.random() - 0.5).slice(0, sideCount)
  const items = [main, ...shuffledSides]

  const baseOrderValue = items.reduce((sum, it) => sum + (it.basePrice || it.price || 100), 0)
  const maxPatience = 22 + (kLevels.patienceBoost - 1) * 3.5

  state.shift.customers[emptyIdx] = {
    id: "cust_" + Math.random().toString(36).slice(2, 8),
    name: arch.name,
    avatar: arch.avatar,
    line: arch.line,
    items,
    baseValue: Math.round(baseOrderValue * k.priceMult),
    patience: maxPatience,
    maxPatience,
  }
}

function doesTraySatisfyCustomer(cust) {
  if (!cust) return false
  const trayIds = state.shift.tray.map((t) => t.id)
  const needed = [...cust.items.map((i) => i.id)]
  for (const reqId of needed) {
    const idx = trayIds.indexOf(reqId)
    if (idx === -1) return false
    trayIds.splice(idx, 1)
  }
  return true
}

function serveCustomer(slotIdx) {
  if (!state.shift.running || state.shift.paused) return
  const cust = state.shift.customers[slotIdx]
  if (!cust) return

  if (!doesTraySatisfyCustomer(cust)) {
    sfx.error()
    showToast("Tray doesn't have all items for this customer yet! Tap their recipe chips to prep.")
    return
  }

  // Remove the customer's items from the tray
  for (const reqItem of cust.items) {
    const idx = state.shift.tray.findIndex((t) => t.id === reqItem.id)
    if (idx >= 0) state.shift.tray.splice(idx, 1)
  }

  // Calculate Naira payout + tips + multipliers
  const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
  const kLevels = state.playerProfile.kitchenLevels?.[k.id] || { tipBonus: 1 }
  const patienceRatio = cust.patience / cust.maxPatience
  const speedTip = Math.round(cust.baseValue * 0.35 * patienceRatio)
  const upgradeMult = 1 + (kLevels.tipBonus - 1) * 0.15
  const vipTipMult = hasPerk("double_tips_300") ? 2 : 1
  const feverMult = state.shift.feverTimeLeft > 0 ? 2 : 1
  const odogwuScoreMult = hasPerk("golden_suya_pass_1500") ? 2 : 1
  const activeEv = LAGOS_CITY_EVENTS[state.activeEventIdx % LAGOS_CITY_EVENTS.length]
  const eventMult = activeEv?.nairaMult || 1.0

  const totalNaira = Math.round((cust.baseValue + speedTip) * upgradeMult * vipTipMult * feverMult * eventMult)
  state.shift.naira += totalNaira
  state.shift.ordersServed += 1
  state.shift.combo += 1

  const orderScore = Math.round(totalNaira * (1 + state.shift.combo * 0.1) * odogwuScoreMult)
  state.shift.score += orderScore

  // Chance to find bonus Gold Peppers on fast serves!
  if (patienceRatio > 0.55) {
    state.shift.peppersFound += 3 + (activeEv?.extraPeppers || 0)
  }

  // Trigger Owambe Fever at 5x combo!
  if (state.shift.combo > 0 && state.shift.combo % 5 === 0) {
    state.shift.feverTimeLeft = 10
    showToast("🎉 OWAMBE FEVER! 2× Naira & Score for 10s!")
  }

  sfx.cashServe()
  state.shift.customers[slotIdx] = null
  state.shift.nextCustomerSpawnIn = Math.min(state.shift.nextCustomerSpawnIn, 0.8)
  renderShiftFrame()
}

function handleWahalaChoice(kind) {
  const s = state.shift
  if (!s.activeWahala) return
  s.activeWahala = null

  if (hasPerk("golden_suya_pass_1500") && kind === "plead_or_odogwu") {
    s.naira += 450
    s.combo += 2
    sfx.upNepa()
    showToast("👑 Odogwu Pass! They salute your VIP kitchen: +₦450 & +2× Combo!")
    renderShiftFrame()
    return
  }

  if (kind === "settle_150") {
    s.naira = Math.max(0, s.naira - 150) + 380
    s.combo += 2
    sfx.cashServe()
    showToast("🕶️ Area Boys hyped your stall! Net +₦230 VIP Hype & +2× Combo!")
  } else if (kind === "dash_food") {
    if (s.tray.length > 0) s.tray.pop()
    s.customers.forEach((c) => {
      if (c) c.patience = c.maxPatience
    })
    sfx.upNepa()
    showToast("🥩 Dashed Suya! All waiting customers' patience restored to 100%!")
  } else if (kind === "show_papers") {
    const anyBurnt = s.grills.some((g) => g.state === "burnt")
    if (!anyBurnt) {
      s.naira += 350
      s.peppersFound += 2
      sfx.upNepa()
      showToast("📄 Clean Kitchen Award! +₦350 & +2🌶️ Gold Peppers!")
    } else {
      s.naira = Math.max(0, s.naira - 100)
      sfx.error()
      showToast("⚠️ Inspector saw burnt food on grill! Paid ₦100 fine.")
    }
  } else if (kind === "jara_100") {
    s.naira = Math.max(0, s.naira - 100)
    s.combo += 2
    s.timeLeft += 4
    sfx.cashServe()
    showToast("🍛 Inspector loved the Jara pack! +4s Shift Time & +2× Combo!")
  } else if (kind === "viral_fever") {
    s.naira = Math.max(0, s.naira - 120)
    s.feverTimeLeft = 8
    sfx.upNepa()
    showToast("🤳🏾 Viral on Lagos TikTok! 8s OWAMBE FEVER (2× Naira & Score)!")
  } else if (kind === "spicy_sample") {
    s.naira += 260
    s.peppersFound += 3
    sfx.cashServe()
    showToast("🌶️ Blogger loved the spicy Yaji! +₦260 & +3🌶️ Gold Peppers!")
  } else if (kind === "quick_tip") {
    s.naira += 140
    sfx.tap()
    showToast("👋🏾 Collected +₦140 quick tip and kept cooking!")
  } else {
    // plead_or_odogwu without Odogwu Pass
    if (Math.random() < 0.65) {
      s.naira += 180
      sfx.tap()
      showToast("🗣️ Smooth Lagos street talk worked! +₦180 bonus!")
    } else {
      sfx.error()
      showToast("😤 They grumbled and left — get Odogwu Pass for automatic VIP respect!")
    }
  }
  renderShiftFrame()
}

function renderShiftFrame() {
  if (!state.shift.running) return
  const s = state.shift

  $("shift-timer").textContent = `${Math.ceil(s.timeLeft)}s`
  $("shift-naira").textContent = `₦${s.naira.toLocaleString("en-NG")}`
  $("shift-combo").textContent = `${s.combo}×`

  if (s.match) {
    $("match-my-score").textContent = `₦${s.naira.toLocaleString("en-NG")}`
    $("match-rival-score").textContent = `₦${Math.floor(s.rivalScore).toLocaleString("en-NG")}`
  }

  $("fever-banner").classList.toggle("hidden", s.feverTimeLeft <= 0)
  $("nepa-alert").classList.toggle("hidden", !s.nepaBlackout)
  if (s.nepaBlackout) {
    $("gen-cranks").textContent = `${s.genCranks}/3`
  }

  // Render Street Wahala Encounter Banner if active
  const wahalaBox = $("wahala-encounter")
  if (wahalaBox) {
    if (s.activeWahala) {
      wahalaBox.classList.remove("hidden")
      $("wahala-avatar").textContent = s.activeWahala.avatar
      $("wahala-title").textContent = s.activeWahala.title
      $("wahala-line").textContent = s.activeWahala.line
      const choicesEl = $("wahala-choices")
      choicesEl.innerHTML = ""
      s.activeWahala.choices.forEach((ch) => {
        const btn = document.createElement("button")
        btn.className = `wahala-btn ${ch.primary ? "primary" : ""}`
        btn.textContent =
          ch.kind === "plead_or_odogwu" && hasPerk("golden_suya_pass_1500") ? "👑 Odogwu VIP" : ch.label
        btn.onclick = () => handleWahalaChoice(ch.kind)
        choicesEl.appendChild(btn)
      })
    } else {
      wahalaBox.classList.add("hidden")
    }
  }

  // Render 3 customer counter slots
  const custBox = $("customer-slots")
  custBox.innerHTML = ""
  s.customers.forEach((c, idx) => {
    const card = document.createElement("div")
    if (!c) {
      card.className = "customer-card"
      card.innerHTML = `<div style="margin:auto;font-size:10px;color:var(--text-muted);text-align:center;">Waiting for customer…</div>`
      custBox.appendChild(card)
      return
    }
    const ready = doesTraySatisfyCustomer(c)
    const pct = Math.max(0, Math.min(100, (c.patience / c.maxPatience) * 100))
    const barColor = pct > 50 ? "#17c964" : pct > 25 ? "#ffb830" : "#ff473a"

    // Check which items are already in tray
    const tempTray = s.tray.map((t) => t.id)
    const chipsHtml = c.items
      .map((item) => {
        const tIdx = tempTray.indexOf(item.id)
        const inTray = tIdx >= 0
        if (inTray) tempTray.splice(tIdx, 1)
        return `<div class="order-chip ${inTray ? "in-tray" : ""}" data-item-id="${item.id}">
          <span>${item.emoji} ${item.name}</span>
          <span>${inTray ? "✓" : "+"}</span>
        </div>`
      })
      .join("")

    card.className = `customer-card ${ready ? "ready-to-serve" : ""}`
    card.innerHTML = `
      <div>
        <div class="cust-top">
          <span class="cust-avatar">${c.avatar}</span>
          <div class="cust-info">
            <div class="cust-name">${c.name}</div>
            <div class="cust-price">₦${c.baseValue}</div>
          </div>
        </div>
        <div class="patience-bar">
          <div class="patience-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="cust-order-items">${chipsHtml}</div>
      </div>
      <button class="cust-serve-btn">${ready ? "⚡ SERVE NOW!" : "Tap items to prep"}</button>
    `

    card.querySelectorAll(".order-chip").forEach((chip) => {
      chip.onclick = (e) => {
        e.stopPropagation()
        smartIngredientAssist(chip.dataset.itemId)
      }
    })
    card.querySelector(".cust-serve-btn").onclick = () => serveCustomer(idx)
    if (ready) {
      card.onclick = () => serveCustomer(idx)
    }
    custBox.appendChild(card)
  })

  // Render Grill Slots
  const grillBox = $("grill-slots")
  grillBox.innerHTML = ""
  s.grills.forEach((g, idx) => {
    const slot = document.createElement("div")
    slot.className = `grill-slot ${g.state}`
    if (g.state === "empty") {
      slot.innerHTML = `<span class="g-emoji">🍳</span><span class="g-status">Empty Slot</span>`
    } else if (g.state === "cooking") {
      const pct = Math.min(100, Math.round(g.progress * 100))
      slot.innerHTML = `<span class="g-emoji">${g.item.emoji}</span><span class="g-status">Sizzling ${pct}%</span>`
    } else if (g.state === "cooked") {
      slot.innerHTML = `<span class="g-emoji">${g.item.emoji}</span><span class="g-status" style="color:#6df5a6">✅ TAP PLATE!</span>`
    } else if (g.state === "burnt") {
      slot.innerHTML = `<span class="g-emoji">💨</span><span class="g-status" style="color:#ff8b82">Burnt! Tap clear</span>`
    }
    slot.onclick = () => handleGrillSlotTap(idx)
    grillBox.appendChild(slot)
  })

  // Render Serving Tray
  const trayBox = $("tray-items")
  if (s.tray.length === 0) {
    trayBox.innerHTML = `<span class="tray-empty">Tap customer chips or prep buttons below…</span>`
  } else {
    trayBox.innerHTML = s.tray
      .map((it, i) => `<span class="tray-pill" data-idx="${i}">${it.emoji} ${it.name} ✕</span>`)
      .join("")
    trayBox.querySelectorAll(".tray-pill").forEach((pill) => {
      pill.onclick = () => {
        s.tray.splice(Number(pill.dataset.idx), 1)
        renderShiftFrame()
      }
    })
  }

  // Enable SERVE! button if any customer matches
  const matchCustIdx = s.customers.findIndex((c) => doesTraySatisfyCustomer(c))
  const serveBtn = $("btn-serve-order")
  serveBtn.disabled = matchCustIdx === -1
  serveBtn.onclick = () => {
    if (matchCustIdx >= 0) serveCustomer(matchCustIdx)
  }

  renderBoostersBar()
}

function renderBoostersBar() {
  const b = state.playerProfile.boosters || { rushBoosts: 0, autoChefs: 0, jaraRefills: 0 }
  $("count-boost-rush").textContent = b.rushBoosts || 0
  $("count-boost-auto").textContent = b.autoChefs || 0
  $("count-boost-jara").textContent = b.jaraRefills || 0
}

// Main 10Hz Game Tick Loop
setInterval(() => {
  const s = state.shift
  if (!s.running || s.paused) return
  const dt = 0.1

  s.timeLeft -= dt
  if (s.feverTimeLeft > 0) s.feverTimeLeft = Math.max(0, s.feverTimeLeft - dt)

  // Rival bot progress in 1v1 match
  if (s.match) {
    const k = KITCHENS[state.selectedKitchenId] || KITCHENS.yaba_suya
    if (Math.random() < 0.22) {
      s.rivalScore += Math.round((25 + Math.random() * 42) * k.priceMult)
    }
  }

  // NEPA Blackout Timer
  if (!s.nepaBlackout && !hasPerk("solar_inverter_500")) {
    s.nextNepaIn -= dt
    if (s.nextNepaIn <= 0 && s.timeLeft > 10) {
      s.nepaBlackout = true
      s.genCranks = 0
      s.nextNepaIn = 26
      sfx.nepaDown()
      showToast("⚡ NEPA TOOK LIGHT! Crank the Generator 3 times!")
    }
  }

  // Mid-Shift Street Wahala Encounter (Area Boys / Inspector / TikTok Blogger)
  if (!s.wahalaTriggered && s.timeLeft <= 45 && s.timeLeft > 18 && !s.nepaBlackout) {
    s.wahalaTriggered = true
    s.activeWahala = WAHALA_ENCOUNTERS[Math.floor(Math.random() * WAHALA_ENCOUNTERS.length)]
    sfx.readyDing()
  }

  // Grill progress
  const kLevels = state.playerProfile.kitchenLevels?.[state.selectedKitchenId] || { grillSpeed: 1 }
  const solarSpeed = hasPerk("solar_inverter_500") ? 1.25 : 1.0
  const nepaPenalty = s.nepaBlackout ? 0.4 : 1.0
  const cookRate = (0.45 + (kLevels.grillSpeed - 1) * 0.1) * solarSpeed * nepaPenalty

  s.grills.forEach((g) => {
    if (g.state === "cooking") {
      g.progress += cookRate * dt
      if (g.progress >= 1) {
        g.state = "cooked"
        g.progress = 1
        sfx.readyDing()
      }
    } else if (g.state === "cooked" && !hasPerk("golden_suya_pass_1500")) {
      g.burnProgress += dt * 0.11
      if (g.burnProgress >= 1) {
        g.state = "burnt"
        sfx.error()
      }
    }
  })

  // Mama Bisi Auto-Chef Booster active
  if (s.autoChefTimeLeft > 0) {
    s.autoChefTimeLeft -= dt
    const waitingIdx = s.customers.findIndex((c) => c !== null)
    if (waitingIdx >= 0 && Math.random() < 0.35) {
      s.tray = [...s.customers[waitingIdx].items]
      serveCustomer(waitingIdx)
    }
  }

  // Customer Patience & Spawning
  s.nextCustomerSpawnIn -= dt
  if (s.nextCustomerSpawnIn <= 0) {
    spawnCustomer()
    s.nextCustomerSpawnIn = 3.2
  }

  s.customers.forEach((c, idx) => {
    if (!c) return
    c.patience -= dt
    if (c.patience <= 0) {
      // Customer walked out angry
      s.customers[idx] = null
      s.combo = 0
      sfx.error()
      showToast(`${c.name} tired of waiting and walked out! Combo reset.`)
    }
  })

  if (s.timeLeft <= 0) {
    finishShift()
    return
  }

  renderShiftFrame()
}, 100)

async function finishShift() {
  state.shift.running = false
  const s = state.shift

  $("sum-orders").textContent = s.ordersServed
  $("sum-naira").textContent = `+₦${s.naira.toLocaleString("en-NG")}`
  $("sum-peppers").textContent = `+🌶️ ${s.peppersFound}`
  $("sum-score").textContent = s.score.toLocaleString("en-NG")
  $("shift-summary-modal").classList.remove("hidden")

  // Sync shift earnings with backend
  await syncWithServer("record_shift", {
    nairaEarned: s.naira,
    score: s.score,
    ordersServed: s.ordersServed,
    peppersFound: s.peppersFound,
  })

  // If 1v1 Multiplayer Match, settle result with server-side HMAC-SHA256 signature!
  const matchBox = $("summary-match-box")
  if (s.match) {
    matchBox.classList.remove("hidden")
    matchBox.textContent = "Verifying & settling 1v1 Cook-Off pot with Vatar server…"
    const { session } = await VatarBridge.session()
    const rival = s.match.players?.find((p) => p.id !== VatarBridge.player.id) || { id: "t_bot_rival", name: "Rival" }
    const res = await fetch("/api/match/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session,
        matchId: s.match.id,
        myScore: s.naira,
        opponentScore: Math.floor(s.rivalScore),
        opponentId: rival.id,
      }),
    })
    const settled = await res.json()
    await refreshChecklist()
    const won = settled.winner === VatarBridge.player.id
    const draw = settled.winner === "draw"
    matchBox.innerHTML = `
      <strong>${won ? "🏆 YOU WON THE 1v1 COOK-OFF!" : draw ? "🤝 DRAW — STAKES RETURNED" : "😤 RIVAL WON THIS ROUND"}</strong><br/>
      <span>You: ₦${s.naira.toLocaleString()} vs ${rival.name}: ₦${Math.floor(s.rivalScore).toLocaleString()}</span><br/>
      <small>Signed w/ <code>X-Vatar-Signature: ${settled.signatureUsed || "v1=…"}</code></small>
    `
    logInspector(`✅ 1v1 Match ${s.match.id} settled (${won ? "WIN" : "LOSS/DRAW"}) via signed POST /matches/{id}/result`)
  } else {
    matchBox.classList.add("hidden")
  }

  // Submit score to Vatar Leaderboard (handles 20s rate limit gracefully)
  const scoreStatus = $("summary-score-status")
  try {
    const sub = await VatarBridge.submitScore(state.playerProfile.bestScore || s.score)
    scoreStatus.textContent = `🏆 Submitted to Vatar Leaderboard (Best: ${sub.best.toLocaleString()} pts)`
  } catch (err) {
    if (err.code === "too_soon") {
      scoreStatus.textContent = `🏆 Score saved! (Vatar leaderboard updates once every 20s)`
    } else {
      scoreStatus.textContent = `🏆 Best Score: ${state.playerProfile.bestScore.toLocaleString()} pts`
    }
  }
}

// ============================================================================
// 7. SANDBOX PAY SHEET & EVENT HANDLERS
// ============================================================================
function openSandboxPaySheet(productId, productMeta) {
  const prod = productMeta || state.catalog[productId] || {
    id: productId,
    name: productId,
    desc: "In-game item",
    amount: 100,
  }
  $("sheet-product-name").textContent = prod.name
  $("sheet-product-desc").textContent = prod.desc
  $("sheet-product-price").textContent = `₦${prod.amount.toLocaleString("en-NG")}`
  $("sheet-btn-amount").textContent = `₦${prod.amount.toLocaleString("en-NG")}`
  $("sandbox-paysheet-modal").classList.remove("hidden")
}

async function resolveSandboxSheet(outcome) {
  $("sandbox-paysheet-modal").classList.add("hidden")
  VatarBridge.resumeListeners.forEach((fn) => fn())
  const pending = VatarBridge.pendingSheetResolver
  VatarBridge.pendingSheetResolver = null
  if (!pending) return

  const r = await fetch("/api/sandbox/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId: VatarBridge.player.id,
      productId: pending.productId,
      outcome,
    }),
  })
  const data = await r.json()
  await refreshChecklist()
  if (r.ok && data.purchaseId) {
    pending.resolve({ purchaseId: data.purchaseId, productId: data.productId })
  } else {
    const err = new Error("Vatar: " + (data.error || "cancelled"))
    err.code = data.error || "cancelled"
    pending.reject(err)
  }
}

function wireEvents() {
  // Bottom Nav
  document.querySelectorAll(".nav-tab").forEach((btn) => {
    btn.onclick = () => {
      sfx.tap()
      if (btn.dataset.screen === "screen-play" && !state.shift.running) {
        startShift(null)
      } else {
        switchScreen(btn.dataset.screen)
      }
    }
  })

  $("open-shop-peppers").onclick = () => {
    sfx.tap()
    switchScreen("screen-shop")
  }

  $("btn-sound").onclick = () => {
    sfx.unlock()
    const muted = sfx.toggleMute()
    $("btn-sound").textContent = muted ? "🔇" : "🔊"
  }

  $("btn-sandbox-drawer").onclick = () => {
    $("dev-inspector").classList.toggle("open")
  }
  $("btn-close-inspector").onclick = () => {
    $("dev-inspector").classList.remove("open")
  }

  // Start Shift & 1v1 Quick buttons
  $("btn-start-shift").onclick = () => startShift(null)
  $("btn-quick-1v1").onclick = () => switchScreen("screen-versus")
  if ($("live-event-banner")) {
    $("live-event-banner").onclick = () => {
      sfx.tap()
      state.activeEventIdx = (state.activeEventIdx + 1) % LAGOS_CITY_EVENTS.length
      renderAllUI()
    }
  }
  $("btn-end-shift").onclick = () => finishShift()
  $("btn-clear-tray").onclick = () => {
    sfx.tap()
    state.shift.tray = []
    renderShiftFrame()
  }

  // Crank Generator during NEPA Blackout
  $("btn-crank-gen").onclick = () => {
    if (!state.shift.nepaBlackout) return
    sfx.sizzle()
    state.shift.genCranks += 1
    if (state.shift.genCranks >= 3) {
      state.shift.nepaBlackout = false
      state.shift.naira += 250
      sfx.upNepa()
      showToast("💡 UP NEPA! +₦250 Fast Generator Bonus!")
    }
    renderShiftFrame()
  }

  // Active Boosters during Shift
  $("btn-boost-rush").onclick = async () => {
    if (!state.shift.running) return
    if ((state.playerProfile.boosters?.rushBoosts || 0) <= 0) {
      showToast("No Instant Grill boosters left! Visit VIP Store.")
      return
    }
    sfx.upNepa()
    await syncWithServer("use_booster", { boosterKey: "rushBoosts" })
    state.shift.grills.forEach((g) => {
      if (g.state === "cooking" || g.state === "burnt") {
        if (g.item) {
          g.state = "cooked"
          g.progress = 1
          g.burnProgress = 0
        } else {
          g.state = "empty"
        }
      }
    })
    showToast("⚡ Instant Grill! All dishes cooked immediately!")
    renderShiftFrame()
  }

  $("btn-boost-auto").onclick = async () => {
    if (!state.shift.running) return
    if ((state.playerProfile.boosters?.autoChefs || 0) <= 0) {
      showToast("No Mama Bisi Auto-Chefs left! Visit VIP Store.")
      return
    }
    sfx.upNepa()
    await syncWithServer("use_booster", { boosterKey: "autoChefs" })
    state.shift.autoChefTimeLeft = 8
    showToast("👩🏾‍🍳 Mama Bisi Auto-Chef serving orders for 8s!")
    renderShiftFrame()
  }

  $("btn-boost-jara").onclick = async () => {
    if (!state.shift.running) return
    if ((state.playerProfile.boosters?.jaraRefills || 0) <= 0) {
      showToast("No Sweet Jara boosters left! Visit VIP Store.")
      return
    }
    sfx.upNepa()
    await syncWithServer("use_booster", { boosterKey: "jaraRefills" })
    state.shift.customers.forEach((c) => {
      if (c) {
        c.patience = c.maxPatience
        c.baseValue += 150
      }
    })
    showToast("🎶 Sweet Jara! Customer patience 100% + ₦150 bonus tip!")
    renderShiftFrame()
  }

  // Exchange Gold Peppers for Boosters in Store
  document.querySelectorAll(".exchange-card").forEach((card) => {
    card.onclick = async () => {
      const boosterKey = card.dataset.booster
      const costPeppers = Number(card.dataset.cost)
      if (state.playerProfile.peppers < costPeppers) {
        sfx.error()
        showToast("Not enough 🌶️ Gold Peppers! Grab a Spice Pack above.")
        return
      }
      sfx.cashServe()
      await syncWithServer("buy_booster_peppers", { boosterKey, costPeppers, qty: 1 })
      showToast("🌶️ Booster added to your kitchen!")
    }
  })

  // 1v1 Multiplayer Match Controls
  document.querySelectorAll(".stake-pill").forEach((pill) => {
    pill.onclick = () => {
      sfx.tap()
      document.querySelectorAll(".stake-pill").forEach((p) => p.classList.remove("active"))
      pill.classList.add("active")
      state.selectedStake = Number(pill.dataset.stake) || 0
    }
  })

  $("btn-match-quick").onclick = async () => {
    sfx.tap()
    showToast(`Finding 1v1 opponent at ₦${state.selectedStake.toLocaleString()} stake…`)
    const match = await VatarBridge.matchQuick(state.selectedStake)
    startShift(match)
  }

  $("btn-match-create").onclick = async () => {
    sfx.tap()
    const match = await VatarBridge.matchCreate(state.selectedStake, 2)
    state.pendingRoomMatch = match
    $("created-room-code").textContent = match.code
    $("created-room-box").classList.remove("hidden")
    showToast(`Created room ${match.code}! Share with a friend or start w/ Test Bot.`)
  }

  $("btn-start-room-bot").onclick = () => {
    if (state.pendingRoomMatch) startShift(state.pendingRoomMatch)
  }

  $("btn-match-join").onclick = async () => {
    const code = $("input-join-code").value.trim().toUpperCase()
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      sfx.error()
      showToast("Enter a valid 6-character room code!")
      return
    }
    const match = await VatarBridge.matchJoin(code)
    startShift(match)
  }

  // Shift Summary Modal Buttons
  $("btn-summary-again").onclick = () => {
    $("shift-summary-modal").classList.add("hidden")
    startShift(null)
  }
  $("btn-summary-home").onclick = () => {
    $("shift-summary-modal").classList.add("hidden")
    switchScreen("screen-home")
  }

  // Leaderboard Refresh
  $("btn-refresh-leaderboard").onclick = () => {
    sfx.tap()
    renderLeaderboard()
  }

  // Sandbox Pay Sheet Buttons
  $("btn-sheet-pay").onclick = () => resolveSandboxSheet("paid")
  $("btn-sheet-fail").onclick = () => resolveSandboxSheet("payment_failed")
  $("btn-sheet-cancel").onclick = () => resolveSandboxSheet("cancelled")

  // Pause & Resume listeners (Review Checklist #4)
  VatarBridge.onPause(() => {
    state.shift.paused = true
    sfx.setPlatformPaused(true)
    if (state.shift.running && $("sandbox-paysheet-modal").classList.contains("hidden")) {
      $("pause-overlay").classList.remove("hidden")
    }
    logInspector("⏸️ Vatar.onPause() triggered — timers & audio stopped.")
  })

  VatarBridge.onResume(() => {
    state.shift.paused = false
    sfx.setPlatformPaused(false)
    $("pause-overlay").classList.add("hidden")
    logInspector("▶️ Vatar.onResume() triggered — timers & audio resumed.")
  })

  $("btn-resume-manual").onclick = () => {
    VatarBridge.resumeListeners.forEach((fn) => fn())
  }

  // One-Click Sandbox Inspector Test Buttons
  $("btn-test-buy-100").onclick = async () => {
    try {
      const res = await VatarBridge.purchase("spices_pack_100", state.catalog.spices_pack_100)
      await claimPurchase(res)
    } catch (e) {
      logInspector(`Purchase flow ended with code: ${e.code}`)
    }
  }

  $("btn-test-webhook").onclick = async () => {
    logInspector("Sending signed purchase.paid webhook to POST /vatar-webhook…")
    const r = await fetch("/api/sandbox/send-test-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: VatarBridge.player.id, productId: "spices_pack_100" }),
    })
    const d = await r.json()
    if (d.ok) {
      state.playerProfile = d.player
      state.checklist = d.checklist
      renderAllUI()
      renderChecklistUI()
      sfx.upNepa()
      showToast("🔔 Signed Webhook (200 OK) verified & delivered!")
      logInspector(`✅ Webhook ${d.deliveryId} verified via X-Vatar-Signature & delivered!`)
    }
  }

  $("btn-test-pause").onclick = () => {
    if (!state.shift.paused) {
      VatarBridge.pauseListeners.forEach((fn) => fn())
      showToast("⏸️ Simulated Vatar.onPause() — Audio & Timers Paused")
    } else {
      VatarBridge.resumeListeners.forEach((fn) => fn())
      showToast("▶️ Simulated Vatar.onResume() — Resumed")
    }
  }

  $("btn-test-match").onclick = async () => {
    logInspector("Creating & settling test 1v1 staked match with HMAC-SHA256 signature…")
    const match = await VatarBridge.matchCreate(1000, 2)
    const { session } = await VatarBridge.session()
    const r = await fetch("/api/match/settle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session,
        matchId: match.id,
        myScore: 4200,
        opponentScore: 3100,
        opponentId: "t_bot_rival",
      }),
    })
    const d = await r.json()
    await refreshChecklist()
    sfx.upNepa()
    showToast(`⚔️ Test Match Settled! Signature: ${d.signatureUsed}`)
    logInspector(`✅ Match ${match.id} settled w/ X-Vatar-Signature (${d.signatureUsed})`)
  }
}

// ============================================================================
// 8. BOOTSTRAP ON PAGE LOAD
// ============================================================================
async function boot() {
  wireEvents()
  const initData = await VatarBridge.init()
  logInspector(`Vatar.init() resolved → player: ${initData.player.name} (${initData.player.id}), mode: ${initData.mode}`)

  // Sync player profile & catalog from backend
  await syncWithServer("load")

  // Recover any paid purchases that weren't marked delivered yet (Spec §3 & §6)
  VatarBridge.onPurchase(claimPurchase)
  const undelivered = await VatarBridge.purchases()
  if (Array.isArray(undelivered) && undelivered.length > 0) {
    for (const p of undelivered) {
      await claimPurchase(p)
    }
  }
}

boot()
