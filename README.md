# 📚 Study Session Timer

A Pomodoro-style study timer built with React + Vite.

## Features

- 🎯 **Focus / Short Break / Long Break** modes
- ⏱ **Animated SVG countdown ring** with colour-coded modes
- 🔁 **Auto-advance** — switches to long break after N focus sessions
- 📊 **Daily stats** — sessions completed and focus minutes today
- 🗂 **Session history** — last 5 sessions with timestamps
- ⚙️ **Configurable** — all durations and session counts adjustable
- 💾 **LocalStorage persistence** — survives page refresh

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy to GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub username.
2. Run:

```bash
npm run deploy
```

Your app will be live at `https://<your-username>.github.io/study-timer`.

## Tech Stack

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [gh-pages](https://github.com/tschaub/gh-pages)
