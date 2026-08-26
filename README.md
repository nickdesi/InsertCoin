<div align="center">

# 🕹️ InsertCoin

**A sleek, responsive retro-gaming collection manager built with React, Vite & Tailwind CSS — ready for Docker & Coolify.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Security Policy](https://img.shields.io/badge/Security-Policy-blue.svg)](SECURITY.md)
[![React](https://img.shields.io/badge/React-18-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ed.svg?logo=docker&logoColor=white)](Dockerfile)
[![Coolify Ready](https://img.shields.io/badge/Coolify-Ready-6366f1.svg?logo=rocket)](https://coolify.io/)
[![GitHub stars](https://img.shields.io/github/stars/nickdesi/InsertCoin?style=social)](https://github.com/nickdesi/InsertCoin/stargazers)

<br />

<p align="center">
  ⭐ <b>If you enjoy managing your retro collection with InsertCoin, please consider giving it a star on GitHub!</b> ⭐
</p>

</div>

---

## ✨ Features

- 🎮 **Comprehensive Game Library** — Catalog retro games across consoles (NES, SNES, Genesis, Game Boy, PS1, Arcade, etc.).
- 💾 **Local-First & Privacy-Focused** — All data persists securely in browser `localStorage` with zero cloud lock-in.
- 🎨 **Arcade & Retro Aesthetic** — Nostalgic visual interface with smooth micro-animations, glassmorphism, and responsive cards.
- 🔍 **Fast Search & Filtering** — Filter by platform, genre, completion status, rating, and custom tags.
- 📦 **Docker & Coolify Native** — Includes optimized multi-stage `Dockerfile` and Nginx configuration for 1-click self-hosting.
- 📱 **Mobile & Desktop Responsive** — Clean layout optimized for smartphones, tablets, and desktop displays.

---

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/nickdesi/InsertCoin.git
cd InsertCoin

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🐳 Self-Hosting with Docker & Coolify

### 1. Run with Docker

```bash
docker build -t insertcoin .
docker run -d -p 8080:80 --name insertcoin-app insertcoin
```

Open `http://localhost:8080`.

### 2. Deploy on Coolify

1. Create a new **Application** in your Coolify dashboard.
2. Select **Public GitHub Repository** and enter `https://github.com/nickdesi/InsertCoin.git`.
3. Set Build Pack to **Dockerfile**.
4. Set Exposed Port to **80**.
5. Click **Deploy**! 🚀

---

## 🌟 Stargazers & Community

<div align="center">

[![Star History Chart](https://api.star-history.com/svg?repos=nickdesi/InsertCoin&type=Date)](https://star-history.com/#nickdesi/InsertCoin&Date)

</div>

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome!
Please check [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) before submitting pull requests.

---

## 📜 License

This project is open-source software licensed under the [MIT License](LICENSE).
