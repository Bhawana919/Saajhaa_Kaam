# Sajha Kaam · साझा काम

**Clear work. Safe pay. Proof that travels.**  
*स्पष्ट काम। सुरक्षित भुक्तानी। जहाँ गए पनि चल्ने प्रमाण।*

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.12-009688.svg)](https://fastapi.tiangolo.com/)
[![Expo](https://img.shields.io/badge/Mobile-Expo%20SDK%2058%20%7C%20React%20Native-000020.svg)](https://expo.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 About Sajha Kaam

**Sajha Kaam** ("Shared Work") is a fair, micro-contracting platform that bridges young Nepali talent with global clients and diaspora businesses (in Sydney, London, and beyond).

### The Problems We Address:
1. **Network-Only Hiring:** In Nepal, hiring overwhelmingly relies on personal connections ("cousin referrals"), shutting out rural youth, women, and first-time freelancers.
2. **Unpaid & Disputed Work:** Samriddhi Foundation reports that **~11.1% (1 in 9)** of freelance projects in Nepal go unpaid due to vague agreements, subjective expectations, and off-platform disputes.
3. **High Platform Barriers:** Traditional platforms like Upwork and Fiverr impose heavy fees, steep cold-start competition, and payment barriers for Nepali domestic accounts.

### How Sajha Kaam Solves Them:
- 🙈 **Blind Merit Hiring:** Clients review applicants based strictly on anonymized work samples (Applicant A, B, C...) — personal identity, photo, gender, and district are hidden.
- 📜 **The Kaam Card:** AI/template-drafted bilingual micro-agreements with concrete "done when" checklists and pre-agreed pricing.
- 🛡️ **Leak Guard & Scam Shield:** Protects applicant privacy and scans chat messages in real time for advance-fee scams or off-platform redirection.
- 💸 **Direct, Zero-Custody Payments:** Payments go directly to the worker's **Khalti** account (which supports international payments via Stripe). The platform never holds worker money.
- 🛂 **Verifiable Work Passport:** Each completed milestone earns an **Ed25519 cryptographically signed** credential and public QR code that any stranger or client worldwide can verify independently.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **Kaam Card Draft & Stress Test** | Transforms raw client prompts into objective, testable deliverables with inline suggested fixes. |
| **Pahilo Kaam Board** | A dedicated discovery board for first-time freelancers ($\le 2$ completed jobs) so newcomers don't compete with veterans. |
| **Fair Pick & Tamper-Evident Receipt** | Applicants are reviewed anonymously; pick decisions are recorded in an append-only SHA-256 hash-chain receipt. |
| **Bilingual Experience** | Built from the ground up in natural Nepali (Devanagari numerals) and English. |
| **Mauri (मौरी) Mascot & Design** | Inspired by Mithila folk art and Nepali truck art with bold ink outlines and earthy tones, avoiding generic "AI slop" gradients. |

---

## 🏗️ Repository Layout

```text
├── sajha-kaam/
│   ├── backend/            # FastAPI + SQLModel (SQLite/PostgreSQL) + PyNaCl Ed25519 signer
│   ├── mobile/             # Expo (SDK 58) + React Native + Expo Router bilingual app
│   ├── config/             # rules.yaml, levels.yaml, task_bands.yaml, skills.yaml
│   ├── shared/             # state_machine.json, kaam_card.schema.json, openapi.json
│   └── docs/               # BRAND.md, AI_AND_DESIGN_RESEARCH.md, NEPALI_REVIEW.md
├── Sajha_Kaam/
│   ├── 01_strategy_and_pitch.md       # Problem, business model, and risk mitigations
│   ├── 02_product_and_architecture.md # Technical specification & UX architecture
│   ├── diagrams/                      # System, data architecture, and wireframe diagrams
│   └── prototype/                     # Standalone HTML/CSS prototype
├── sajha-kaam-slides/      # Remotion-based video and pitch presentation
├── requirements.txt        # Pinned Python dependencies
└── command.md              # Detailed command line guide
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.12+**
- **Node.js v20+** and **npm**
- **Expo Go** app on your phone (optional, for mobile testing)

---

### 2. Backend Setup & Run (Terminal 1)

```powershell
# Navigate to the backend folder
cd sajha-kaam\backend

# Start the FastAPI server (auto-creates and seeds SQLite database)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

- **API URL:** `http://localhost:8000`
- **Swagger Docs:** `http://localhost:8000/docs`
- **Demo Signing Key:** `http://localhost:8000/.well-known/sajha-kaam-keys.json`

---

### 3. Frontend / Mobile App Run (Terminal 2)

```powershell
# Navigate to the mobile folder
cd sajha-kaam\mobile

# Install dependencies (first time only)
npm install

# Start the Expo development server
npx expo start -c
```

- **Open on Web:** Press **`w`** in the terminal to view in your browser at `http://localhost:8081`.
- **Open on Mobile:** Scan the terminal QR code with the **Expo Go** app on your phone *(laptop and phone must be on the same Wi-Fi)*.

---

### 4. Demo Mode & Test Accounts

The backend includes seeded sample accounts. The password for **all demo users** is:

> **Password:** `sajha-demo`

| User | Role | Purpose |
|---|---|---|
| **Ramesh K.** | Client (Sydney) | Creates Kaam Cards, conducts blind reviews, approves milestones |
| **Anjali Thapa** | Worker (Surkhet) | Applies anonymously (Applicant F), delivers work, earns Passport proof |

To reset the sample demo database at any time:
```powershell
curl.exe -X POST http://localhost:8000/demo/reset
```

---

## 🔐 Security & Verifiable Proof

- **Cryptographic Work Passport:** Work credentials are signed with **Ed25519** and structured like W3C Verifiable Credentials.
- **Fair Pick Receipt:** Applicant order and reviewer actions are verified using an append-only SHA-256 hash-chain that can be recomputed directly in any web browser.
- **Privacy First:** Applications are sanitized with **Leak Guard** to remove phone numbers, emails, handles, and EXIF metadata before review.

---

## 📄 License

This project is licensed under the MIT License.

