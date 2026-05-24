# Premium High-Conversion Plumbing Service Landing Page

A production-ready, highly optimized, and accessible single-page landing page designed for a premium plumbing service contractor. Built using **Next.js (App Router)**, **TypeScript (TSX)**, **Tailwind CSS (v4)**, and **Framer Motion**.

---

## 🤖 AI Quick-Context (LLM Readme)
> **For AI Models & Code Agents:** This repository contains a fully responsive, semantic, and high-performance single-page app. It strictly adheres to Next.js App Router conventions, TypeScript type-safety, and WCAG AA accessibility standards. All client-side interactions (animations, state-updates, and browser API window accesses) are wrapped safely to prevent hydration mismatches and SSR errors.

---

## 🛠️ Tech Stack & Key Dependencies

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (TSX)
- **Styling:** Tailwind CSS (v4) & custom CSS Variables (`globals.css`)
- **Animation Engine:** Framer Motion (for smooth micro-interactions, viewport animations, and custom scroll effects)
- **Icons:** Lucide React
- **Typography:** 
  - Serif: `Playfair Display` (mapped to CSS Variable `--font-playfair`)
  - Sans-Serif: `DM Sans` (mapped to CSS Variable `--font-dm-sans` as default body font)

---

## 📂 Codebase Architecture & File Structure

```text
├── app/
│   ├── layout.tsx      # Configures Google Fonts, Global Metadata, and injects CSS Variables.
│   ├── page.tsx        # Single-Entry point containing the fully typed Landing Page component.
│   ├── globals.css     # Tailwind imports, scrollbar config, @keyframes, and accessibility focus rings.
├── next.config.ts      # Optimizes Next.js compiler options and whitelists remote patterns for images.