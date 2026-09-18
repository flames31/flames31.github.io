// All of the site's content. Placeholders are in [BRACKETS].
// To add a project or a job, add another entry. Icon names are the keys in icons.ts.

import type { IconName } from "@/icons"

export const profile = {
  name: "Rahul Raghupathi",
  role: "software engineer · distributed systems",
  about:
    "I build backend systems — mostly Go and Java, with TypeScript on top. " +
    "Lately that means streaming pipelines, Postgres at scale, and LLM tooling " +
    "that earns its keep.",
  links: [
    { label: "github", href: "https://github.com/flames31", icon: "github" },
    { label: "linkedin", href: "https://linkedin.com/in/rahulraghupathi", icon: "linkedin" },
  ] satisfies { label: string; href: string; icon: IconName }[],
}

export type Project = {
  id: string
  title: string
  desc: string
  stack: IconName[]
  // shown in the project's dialog
  problem: string
  approach: string
  results: string
  repo?: string
}

export const projects: Project[] = [
  {
    id: "incident-responder",
    title: "AI-Powered Incident Responder",
    desc: "Investigates failures across distributed services from telemetry, then verifies its own recovery.",
    stack: ["go", "prometheus", "grafana", "kubernetes", "postgresql"],
    problem: "[What broke, for whom, and why the existing tooling fell short.]",
    approach: "[How it works — the architecture in two or three sentences.]",
    results: "[What changed — numbers if you have them.]",
  },
  {
    id: "document-extractor",
    title: "Multi-Document Extractor",
    desc: "Multi-tenant API where each tenant defines its own extraction schema.",
    stack: ["nestjs", "typescript", "postgresql", "redis", "react", "docker"],
    problem: "[What broke, for whom, and why the existing tooling fell short.]",
    approach: "[How it works — the architecture in two or three sentences.]",
    results: "[What changed — numbers if you have them.]",
  },
  {
    id: "cloud-optimizer",
    title: "Multi-Cloud Optimization Bot",
    desc: "Finds over-provisioned workloads across clouds and right-sizes them automatically.",
    stack: ["python", "amazonwebservices", "googlecloud", "kubernetes", "githubactions"],
    problem: "[What broke, for whom, and why the existing tooling fell short.]",
    approach: "[How it works — the architecture in two or three sentences.]",
    results: "[What changed — numbers if you have them.]",
  },
]

export type Job = {
  org: string
  role: string
  dates: string
  current?: boolean
  bullets: string[]
  stack: IconName[]
}

export const jobs: Job[] = [
  {
    org: "Global Health Impact",
    role: "Software Engineer · Remote",
    dates: "2026 — present",
    current: true,
    bullets: ["[What you own there.]", "[One result you're proud of.]"],
    stack: [],
  },
  {
    org: "IG Group",
    role: "Software Engineer · Bangalore",
    dates: "2022 — 2024",
    bullets: ["[What you owned there.]", "[One result you're proud of.]"],
    stack: [],
  },
  {
    org: "Indiana University Bloomington",
    role: "M.S. Computer Science",
    dates: "2024 — 2026",
    bullets: ["[Focus area, thesis or notable coursework.]"],
    stack: [],
  },
]
