# MENTOR.AI — Intelligent AI Coding Mentor & Technical Career Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?logo=express)](https://expressjs.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2.svg?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**MENTOR.AI** is a full-stack developer learning platform and AI-powered coding companion. It integrates conversational AI guidance, an interactive code editor, curated algorithmic practice problems with automated test suites, realistic technical mock interviews, structured learning roadmaps, and gamified progress tracking.

> **Production Notice**: MENTOR.AI features a production-oriented full-stack architecture with modular components, strong typing, and server-side secret management. Additional external sandboxing (e.g., Judge0, Piston, or containerized microVMs) is required before exposing arbitrary user code execution to untrusted public traffic.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Screenshots & UI Previews](#screenshots--ui-previews)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Development Server](#development-server)
  - [Production Build & Start](#production-build--start)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Security & Code Execution Architecture](#security--code-execution-architecture)
- [Future Improvements](#future-improvements)
- [Contributing & License](#contributing--license)

---

## Key Features

### 1. 🤖 AI Coding Mentor & Conversational Assistant
- **Context-Aware Assistance**: Automatically synchronizes with the active editor workspace, current practice challenge, and recent test execution outputs.
- **Multi-Modal Capabilities**: Supports file attachments (source files, images, logs), code syntax highlighting with one-click copy, and speech-to-text / text-to-speech interaction.
- **Smart Presets**: Instant prompt suggestions for Big-O complexity analysis, bug diagnosis, algorithmic optimization, and concept explanations.

### 2. 💻 Interactive Code Workspace & Diagnostic Engine
- **Multi-Language Execution**: Run JavaScript, TypeScript, and Python with real-time console feedback.
- **Automated Test Harness**: Evaluate solutions against public and hidden test cases with execution time, memory tracking, and diff views.
- **One-Click AI Diagnostics**: Instant error analysis and contextual hints without revealing full solutions prematurely.
- **Code Utilities**: Integrated formatters, syntax auditors, and customizable editor font sizes.

### 3. 📚 Algorithm Practice Problems
- **59+ Curated Challenges**: Spanning foundational to advanced data structures (Arrays, Strings, Hash Maps, Two Pointers, Sliding Window, Linked Lists, Trees, Graphs, Dynamic Programming, and System Design).
- **Rich Problem Specs**: Comprehensive problem descriptions, constraints, examples with edge cases, reference solutions, and structured test runners.
- **Direct Workspace Integration**: Seamlessly load any problem directly into the interactive code editor.

### 4. 🎯 Technical Mock Interview Simulator
- **Company & Role Customization**: Tailor simulations to target companies (Google, Meta, Amazon, Apple, Microsoft, Netflix) and engineering roles (Frontend, Backend, Full-Stack, Systems, ML).
- **Timed Simulations**: Realistic 30-minute timed sessions with configurable question counts and difficulty tiers.
- **Multi-Dimensional AI Rubric**: Generates detailed scores across Problem Solving, Code Quality, Communication, and Time/Space Complexity along with targeted improvement recommendations.
- **Session History & Analytics**: Local persistence of past interview results, scores, and review breakdowns.

### 5. 🗺️ Interactive Learning Roadmaps
- **Structured Career Tracks**: Comprehensive curriculum paths for Python Mastery, Data Structures & Algorithms, Full-Stack Web Development, and Machine Learning.
- **Progress Tracking**: Interactive milestone checkpoints, topic completion states, and direct links to relevant practice problems and AI mentor discussions.

### 6. 🏆 Gamified Progress & Skill Diagnostics
- **XP & Leveling System**: Dynamic level progression based on solved challenges, completed interviews, and daily check-ins.
- **Streak Tracker**: Tracks daily active coding streaks with calendar activity visualizations.
- **Milestone Badges**: Unlockable achievements for algorithm milestones, interview excellence, and consistency.
- **Skill Diagnostics**: Visual topic mastery breakdown identifying strength areas and recommended practice targets.

### 7. 🎨 Responsive UI & Theme Modes
- **Adaptive Theme System**: Seamless toggling between high-contrast Dark and refined Light modes.
- **Mobile & Desktop Optimized**: Responsive layouts with persistent desktop navigation and a touch-friendly mobile navigation bar.

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                   MENTOR.AI Client                     │
│    (React 19 + TypeScript + Tailwind CSS 4 + Vite)     │
│                                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────────┐ │
│  │ AI Chat View │ │ Code Editor  │ │ Practice View   │ │
│  └──────┬───────┘ └──────┬───────┘ └────────┬────────┘ │
│  ┌──────┴───────┐ ┌──────┴───────┐ ┌────────┴────────┐ │
│  │  Roadmaps    │ │  Interviews  │ │ Progress & XP   │ │
│  └──────────────┘ └──────────────┘ └─────────────────┘ │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS / JSON API
┌───────────────────────────▼────────────────────────────┐
│                  Express API Server                    │
│                  (server.ts / Node.js)                 │
│                                                        │
│  ┌───────────────────────┐   ┌───────────────────────┐ │
│  │      API Routes       │   │  Dev Subprocess Runner│ │
│  │  /api/mentor/chat     │   │  - Timeouts (5-7s)    │ │
│  │  /api/mentor/action   │   │  - Output Caps (64KB) │ │
│  │  /api/mentor/score    │   │  - Payload Caps(128KB)│ │
│  │  /api/execute         │   │  - Sanitized Safe Env │ │
│  └───────────┬───────────┘   └───────────────────────┘ │
└──────────────┼─────────────────────────────────────────┘
               │ Secure Server-Side SDK
┌──────────────▼─────────────────────────────────────────┐
│              Google Gemini AI Platform                 │
│        (gemini-2.5-flash / gemini-2.5-pro)             │
└────────────────────────────────────────────────────────┘
```

---

## Screenshots & UI Previews

| AI Coding Mentor & Workspace | Algorithm Practice Bank |
|:---:|:---:|
| *(Interactive Coding Workspace & Real-time AI Mentor)* | *(59+ LeetCode-style Curated Problems with Test Runner)* |

| Mock Technical Interview Simulator | Career Roadmap & Skill Analytics |
|:---:|:---:|
| *(Company-Specific Timed Interview Rounds with AI Scoring)* | *(Interactive Roadmaps & XP Progress Matrix)* |

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Tailwind CSS 4, Vite 6, `lucide-react`, `motion` |
| **Backend** | Express 4, Node.js 20+, `dotenv`, `tsx`, `esbuild` |
| **AI Integration** | `@google/genai` (Google Gen AI SDK) targeting `gemini-2.5-flash` with model fallback |
| **Storage & Persistence** | Browser `localStorage` with versioned schemas, defensive defaults, and reset utilities |

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (`v20.x LTS` recommended)
- **npm**: `v9.0.0` or higher
- **Google Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mentor-ai.git
   cd mentor-ai
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and configure your API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3000
   ```

> [!CAUTION]
> Never commit your `.env` file to version control. The `.gitignore` file is pre-configured to exclude all `.env` files except `.env.example`.

### Development Server

Start the full-stack development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build & Start

1. **Compile the production assets**:
   ```bash
   npm run build
   ```
   *This bundles the client-side React app into `dist/` and compiles the backend into a standalone CommonJS bundle at `dist/server.cjs` using `esbuild`.*

2. **Start the production server**:
   ```bash
   npm start
   ```

---

## Project Structure

```
mentor-ai/
├── src/
│   ├── components/                # Modular React UI views
│   │   ├── AIChatView.tsx         # AI Mentor chat & multi-modal interface
│   │   ├── CodeEditorView.tsx     # Interactive code editor & test runner
│   │   ├── DashboardView.tsx      # Main dashboard & activity highlights
│   │   ├── LearningRoadmapView.tsx# Visual career & curriculum roadmaps
│   │   ├── MockInterviewView.tsx  # Timed mock technical interview simulator
│   │   ├── MobileNav.tsx          # Mobile navigation bar
│   │   ├── PracticeProblemsView.tsx # Algorithm practice directory
│   │   ├── ProgressDashboardView.tsx# Skill radar, analytics & streak matrix
│   │   ├── SettingsView.tsx       # Theme, font scale & data management
│   │   └── Sidebar.tsx            # Desktop sidebar navigation
│   ├── utils/                     # Business logic & algorithms
│   │   ├── centralTracking.ts     # Activity tracking & event dispatchers
│   │   ├── gamification.ts        # XP, streaks, levels & milestone badges
│   │   └── interviewStorage.ts    # Interview history local persistence
│   ├── roadmap/                   # Curated career tracks & topic curricula
│   ├── problemsData.ts            # Curated problems & test case manifests
│   ├── problemSolutionsData.ts    # Optimal solutions & explanation specs
│   ├── types.ts                   # Core TypeScript types & data contracts
│   ├── App.tsx                    # Root application component & routing
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global Tailwind CSS entry
├── scripts/                       # Maintenance & solution verification scripts
├── server.ts                      # Express API backend & code execution runner
├── .env.example                   # Environment variable template
├── .gitignore                     # Production-ready git ignore rules
├── DEPLOYMENT.md                  # Dedicated production deployment guide
├── LICENSE                        # MIT License
├── metadata.json                  # Application metadata declaration
├── package.json                   # Project manifest & scripts
├── package-lock.json              # Deterministic dependency lock file
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Express server with Vite middleware in development mode via `tsx` |
| `npm run build` | Builds the frontend (`vite build`) and bundles the backend (`esbuild server.ts`) into `dist/` |
| `npm start` | Runs the compiled production server (`dist/server.cjs`) on port 3000 |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) across the entire project |

---

## Security & Code Execution Architecture

### 1. API Key Protection
- The Google Gemini API key is strictly accessed on the server via `process.env.GEMINI_API_KEY`.
- The frontend client makes requests to `/api/mentor/*` routes and never receives raw API credentials.

### 2. Local vs. Production Code Execution

#### Current Development Runner (Included)
For local development and single-tenant testing, `server.ts` includes a lightweight host runner using `child_process.spawn`:
- **Execution Timeouts**: 5,000ms - 7,000ms strict wall-clock timers.
- **Output Buffers**: Capped at 64KB with automatic termination upon stream flooding.
- **Payload Limits**: Request payload capped at 128KB code and 64KB stdin.
- **Environment Sanitization**: Strips secrets, isolates `HOME` and `TMPDIR` to ephemeral directories.

#### Recommended Public Production Architecture
In a multi-tenant public production deployment, arbitrary user code must **NOT** be executed directly on the application server. Instead, route execution requests through an isolated execution microservice:

```
┌─────────────────┐       ┌──────────────────────┐       ┌───────────────────────────┐
│                 │ HTTPS │                      │ HTTPS │ Isolated Sandbox Engine   │
│ Client Browser  ├──────►│ Express API Server   ├──────►│ (Judge0 / Piston / nsjail)│
│                 │       │ (/api/execute)       │       │ - Kernel Namespaces       │
└─────────────────┘       └──────────────────────┘       │ - Memory/CPU cgroups      │
                                                         │ - Network Disabled        │
                                                         └─────────────┬─────────────┘
                                                                       │
                                                                       ▼
                                                          Execution Result (stdout/stderr)
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment and sandboxing specifications.

---

## Future Improvements

- [ ] **Remote Sandbox Integration**: Native adapter for Judge0 and Piston APIs.
- [ ] **Multi-User Collaboration**: Live pair-programming sessions with WebSockets.
- [ ] **Monaco Editor Integration**: Advanced IDE features like IntelliSense and multi-file project trees.
- [ ] **Cloud Storage Synchronization**: Optional account sync with Firestore or PostgreSQL.
- [ ] **Voice Interview Mode**: Full duplex audio interview mode using Gemini Live API.

---

## Contributing & License

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
