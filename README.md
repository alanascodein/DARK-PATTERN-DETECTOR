# 🔍 Dark Pattern Detector

A browser-based tool that analyzes text from Terms & Conditions, privacy policies, and websites to detect manipulative **dark patterns** — deceptive design tactics used to trick users into agreeing to things they didn't intend to.

🌐 **[Live Demo](https://dark-pattern-detector.vercel.app)**

---

## What are Dark Patterns?

Dark patterns are deceptive techniques used by websites and apps to manipulate user behavior — like hiding opt-outs, pre-checking consent boxes, or burying arbitration clauses in legal jargon. This tool helps you spot them before you agree.

---

## Features

- Paste any text (T&C, privacy policy, sign-up flow copy) and analyze it instantly
- Detects **12 dark pattern types** including:
  - Urgency & Scarcity
  - Confirmshaming
  - Forced Consent
  - Pre-selection
  - Roach Motel (hard to cancel)
  - Hidden Opt-out
  - Data Harvesting
  - Legalese Obfuscation
  - Arbitration Trap
  - Auto-renewal Trap
  - Jurisdiction Manipulation
- Risk scoring system (Low / Medium / High / Extremely High)
- Highlights matched phrases directly in the text
- Pattern cards with explanations and matched snippets
- Score breakdown table per pattern type

---

## How to Use

1. Visit the [live demo](https://dark-pattern-detector.vercel.app)
2. Paste any Terms & Conditions or website text into the input box
3. Click **Analyze**
4. Review the risk score, highlighted text, and pattern cards

---

## Tech Stack

- HTML, CSS, JavaScript (vanilla — no frameworks)
- Regex-based pattern matching
- Deployed on [Vercel](https://vercel.com)

---

## Run Locally

```bash
git clone https://github.com/alanascodein/DARK-PATTERN-DETECTOR
cd DARK-PATTERN-DETECTOR
```

Then just open `index.html` in your browser — no build step needed.

---

## Project Structure

```
DARK-PATTERN-DETECTOR/
├── index.html       # Main UI
├── script.js        # Pattern detection logic
├── style.css        # Styling
└── README.md
```

---

## Made by

**Alan A S** — [@alanascodein](https://github.com/alanascodein)
