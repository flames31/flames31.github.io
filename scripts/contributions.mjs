// Fetches this year's GitHub contribution calendar into src/generated/contributions.json,
// so the heatmap ships as static data: no token, no request from the browser.
// Runs before every build; the deploy workflow also rebuilds daily to keep it fresh.
// If GitHub is unreachable it keeps the last file (or writes an empty one) rather than failing the build.

import fs from "node:fs"

const USER = "flames31"
const OUT = new URL("../src/generated/contributions.json", import.meta.url)
const year = new Date().getUTCFullYear()

try {
  const res = await fetch(`https://github.com/users/${USER}/contributions?from=${year}-01-01&to=${year}-12-31`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()

  // per-day counts live in tooltips, linked to their cell by id
  const counts = {}
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts[id] = Number(text.match(/^(\d+) contribution/)?.[1] ?? 0)
  }

  const days = []
  for (const [td] of html.matchAll(/<td[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const attr = (n) => td.match(new RegExp(`\\b${n}="([^"]*)"`))?.[1]
    days.push({ date: attr("data-date"), level: Number(attr("data-level")), count: counts[attr("id")] ?? 0 })
  }
  if (!days.length) throw new Error("no days found — GitHub's markup may have changed")
  days.sort((a, b) => a.date.localeCompare(b.date))

  const total = Number(html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)/)?.[1].replace(/,/g, "") ??
    days.reduce((n, d) => n + d.count, 0))

  write({ user: USER, year, total, days })
  console.log(`contributions: ${total} in ${year} (${days.length} days)`)
} catch (e) {
  console.warn(`contributions: fetch failed (${e.message})`)
  if (!fs.existsSync(OUT)) write({ user: USER, year, total: 0, days: [] })
}

function write(data) {
  fs.mkdirSync(new URL(".", OUT), { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(data) + "\n")
}
