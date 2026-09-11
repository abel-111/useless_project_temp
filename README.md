<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

# Ghost Detector 👻

A satirical paranormal investigation tool that pretends to analyze your photos, videos, and audio for "paranormal activity" — complete with dramatic fake detection logic, spooky animations, and an AI-generated haunting report.

**This is a comedy/novelty project** — nothing here actually detects ghosts. The goal is a fun, dramatic, shareable experience.

## Basic Details

### Team Name: Omen & Iris

### Team Members
- Abel Shibu
- Antony S Kanampuzha

### Project Description
Upload a photo, video, and/or audio clip. Ghost Detector runs a dramatically-presented fake paranormal scan — detecting "orbs" in photos, "cold spots" and "EMF spikes" in video, and "EVP captures" in audio — then generates an AI-powered spooky verdict with a Haunting Severity Rating.

### The Problem (that doesn't exist)
How do you know if your house, classroom, or that weird corner of your room is haunted? You could call a professional, but they're expensive and probably fake. What you REALLY need is a website that's DEFINITELY fake — but way more entertaining.

### The Solution (that nobody asked for)
Ghost Detector: a web app that uses your phone's camera roll and AI to generate a completely fabricated but cinematically dramatic paranormal investigation report. Upload evidence, watch the spooky scan animations, and share your Haunting Severity Rating with your friends.

## Technical Details

### Technologies/Components Used

**Languages:**
- JavaScript (ES Modules)
- HTML5
- CSS3

**Frameworks:**
- React 18
- Vite 5 (build tool)
- Express.js (backend API)
- Tailwind CSS 3

**Libraries:**
- `@anthropic-ai/sdk` — Claude AI for generating paranormal verdicts + photo analysis via Vision API
- `html-to-image` — Render the report card as a downloadable PNG
- Web Audio API (browser-native) — Audio analysis for EVP detection + synthesized sound effects
- Canvas API (browser-native) — Orb overlays, video frame sampling, waveform visualization

**Tools:**
- Node.js
- npm
- Git

## Implementation

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/useless_project_temp.git
cd useless_project_temp

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key
```

### Run

```bash
# Terminal 1: Start the backend server
cd server
npm run dev
# Server runs on http://localhost:3001

# Terminal 2: Start the frontend dev server
cd client
npm run dev
# App runs on http://localhost:5173
```

> **Note:** The app works without an Anthropic API key — it will use locally-generated fallback reports. Add your API key in `server/.env` for AI-generated verdicts.

## Features

### 1. Upload Screen
- Dark, spooky theme with CRT scanline effect, flickering text, and drifting fog
- Three optional upload slots: photo, video, and audio
- File preview, drag-and-drop support, size/type validation
- "BEGIN PARANORMAL SCAN" button (requires at least one file)

### 2. Paranormal Scan Screen
- **Orb Detection** (photo): Canvas overlay draws random glowing orbs on top of your photo
- **Cold Spot & EMF Analysis** (video): Frame brightness sampling detects "cold spots", animated EMF meter with dramatic spikes
- **EVP Detection** (audio): Web Audio API analyzes waveform peaks, animated waveform visualizer
- Progress bar and live counters for each detection type
- Claude Vision API analyzes the actual photo content for an ominous observation

### 3. AI Ghost Report
- All scan stats sent to Claude AI via server-side API call
- Theatrical paranormal verdict generated in the style of a TV ghost hunter
- Haunting Severity Rating out of 10 with color-coded severity bar
- Styled "report card" with decorative framing

### 4. Share & Download
- **Download as Image**: Renders the report card as a PNG using `html-to-image`
- **Copy Report Text**: Copies the full verdict to clipboard
- **Scan Again**: Reset and start fresh

### 5. Sound Effects
- Synthesized via Web Audio API (no external audio files)
- Static crackle on scan start, low drone during processing, dramatic chord on report reveal
- Muted by default with a toggle button

## Project Documentation

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                    │
│                                                     │
│  Landing Screen → Scan Screen → Results Screen      │
│  (Upload)         (Animations)   (AI Report)        │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Analysis Modules (Client-Side)              │    │
│  │  • OrbDetection (Canvas overlay)             │    │
│  │  • ColdSpotDetection (Video frame sampling)  │    │
│  │  • EVPDetection (Web Audio API)              │    │
│  │  • EMFMeter (Animated gauge)                 │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┘
                       │ POST /api/analyze-photo
                       │ POST /api/report
                       ▼
┌─────────────────────────────────────────────────────┐
│                  SERVER (Express)                    │
│                                                     │
│  • /api/analyze-photo → Claude Vision API           │
│  • /api/report → Claude API (paranormal verdict)    │
│  • API key stored server-side in .env               │
│  • Fallback responses when API is unavailable       │
└─────────────────────────────────────────────────────┘
```

### Screenshots

> Screenshots will be added after deployment

### Edge Cases Handled
- No files uploaded → scan button disabled with hint text
- File too large (>50MB) → clear error message per upload slot
- Wrong file type → validation with descriptive error
- Claude API failure → fallback locally-generated spooky report
- Silent/short audio with no peaks → graceful `evpCount: 0`
- Video not loading → cold spot detection skips gracefully

## Team Contributions
- **Abel Shibu**: Frontend development, scan animations, UI/UX design
- **Antony S Kanampuzha**: Backend API, Claude AI integration, audio/video analysis logic

---
Made with ❤️ at TinkerHub Useless Projects

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
