# Gemini Chat

A full-stack AI chat application built with Next.js and the Google Gemini API. Features a persistent chat history sidebar, multi-turn conversations, and a clean minimal UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Google Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## Table of Contents

- [Features](#features)
- [Screenshot](#screenshot)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Environment Variables](#environment-variables)
- [Key Concepts Demonstrated](#key-concepts-demonstrated)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

- **Multi-turn conversations** — Gemini remembers the full context of each chat
- **Persistent chat history** — conversations are saved to localStorage and survive page refreshes
- **Sidebar navigation** — switch between past conversations instantly
- **Secure API key handling** — your Gemini API key lives on the server, never exposed to the browser
- **Clean minimal UI** — light theme, chat bubbles, auto-scroll, Enter to send

---

## Screenshot

![Gemini Chat UI](./assets/screenshot.png)


## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **AI API:** Google Gemini 2.5 Flash
- **Styling:** Inline styles (no CSS framework)
- **Storage:** localStorage (browser-side persistence)
- **Language:** JavaScript

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key — get one free at [aistudio.google.com](https://aistudio.google.com)



### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/gemini-chat.git
cd gemini-chat
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the root of the project
```
GEMINI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Project Structure

```
gemini-chat/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.js      # Backend API route — calls Gemini
│   ├── page.js               # Frontend UI — chat interface
│   ├── layout.js             # App shell
│   └── globals.css           # Global reset styles
├── .env.local                # Your API key (never committed)
├── .gitignore
└── package.json
```

---

## How It Works

The app follows a secure client → server → AI architecture:

```
Browser (page.js)
    ↓  POST /api/chat  { history: [...] }
Next.js Backend (route.js)
    ↓  POST to Gemini API with secret key
Google Gemini
    ↓  returns AI reply
Next.js Backend
    ↓  returns { reply: "..." }
Browser
    ↓  updates UI, saves to localStorage
```

The frontend never talks to Gemini directly. All API calls go through the Next.js API route, which is the only place the API key is used. This keeps your credentials safe.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key from AI Studio |


---

## Key Concepts Demonstrated

- **Next.js App Router** with a frontend page and a backend API route in the same project
- **Stateless API handling** — full conversation history is sent with every request since LLMs have no memory between calls
- **React state management** — `useState` for UI state, `useEffect` for side effects like localStorage and auto-scroll
- **Error handling** — API errors are caught at both the server and client level
- **localStorage persistence** — chats are serialized to JSON and stored in the browser

---

## Future Improvements

- [ ] Add a database (e.g. Supabase) for cross-device chat history
- [ ] Add user authentication
- [ ] Support markdown rendering in AI responses
- [ ] Add streaming responses for faster perceived performance
- [ ] Make the UI mobile responsive

---

## License

MIT — free to use, modify, and distribute.
