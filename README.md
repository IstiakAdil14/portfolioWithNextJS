# Md. Istiak Hussain Adil — Full Stack Portfolio System

A complete, production-ready portfolio system consisting of two projects:

- **`portfolio/`** — Public-facing portfolio website
- **`portfolio-admin/`** — Secure admin dashboard for managing all content

All content is stored in MongoDB and managed through the admin panel — no code changes needed to update the portfolio.

---

## Monorepo Structure

```
webpp/
├── portfolio/          # Public portfolio site (Next.js 13, Pages Router)
└── portfolio-admin/    # Admin dashboard (Next.js 15, App Router)
```

---

## Portfolio (`/portfolio`)

The public-facing portfolio website showcasing projects, skills, background, and contact info.

### Pages

| Page | Description |
|---|---|
| `/` | Home — hero, tech stack, expertise, terminal, GitHub stats |
| `/portfolio` | Projects showcase with live links |
| `/background` | Education & experience timeline |
| `/contact` | Contact form with email integration |

### Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 13 (Pages Router) |
| Styling | Tailwind CSS, Custom CSS |
| Font | EPIC PRO |
| Database | MongoDB Atlas + Mongoose |
| Animations | Framer Motion |
| Email | Nodemailer + Gmail |
| UI Components | Ant Design |
| Data Fetching | React Query + Axios |
| Icons | React Icons |

### API Routes

| Endpoint | Description |
|---|---|
| `GET /api/expertise` | Expertise cards |
| `GET /api/portfolio` | Projects |
| `GET /api/background` | Education & experience |
| `GET /api/skills` | Skill bars |
| `GET /api/profile` | Profile info |
| `GET /api/meta?key=` | Tech stack, currently doing, fun stats, availability |
| `POST /api/send-email` | Contact form email |

---

## Portfolio Admin (`/portfolio-admin`)

A secure, password-protected admin dashboard to manage all portfolio content in real time.

### Features

- 🔐 Secure authentication with session management
- 📁 Projects & case studies management
- 🧠 Skills & technologies editor
- 🎯 Expertise sections control
- ⚡ Live sync — changes reflect instantly on the portfolio
- 🎨 Glassmorphism UI with animated background and custom cursor

### Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | EPIC PRO |
| Database | MongoDB |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Gmail account with App Password (for contact form)
- EPIC PRO font file (`GC-EPICPRO-Demo-BF6891cc5419ab8.ttf`) in both `public/fonts/` folders

### 1. Clone the repository

```bash
git clone https://github.com/IstiakAdil14/portfolioWithNextJS.git
cd portfolioWithNextJS
```

### 2. Setup Portfolio

```bash
cd portfolio
npm install
```

Create `portfolio/.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

### 3. Setup Portfolio Admin

```bash
cd ../portfolio-admin
npm install
```

Create `portfolio-admin/.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Seed the database

```bash
cd portfolio-admin
node seed.mjs
```

### 5. Run both projects

```bash
# Terminal 1 — Portfolio (port 3000)
cd portfolio && npm run dev

# Terminal 2 — Admin (port 3001)
cd portfolio-admin && npm run dev -- --port 3001
```

---

## Font Setup

Both projects use **EPIC PRO** font. Place the font file in both:

```
portfolio/public/fonts/GC-EPICPRO-Demo-BF6891cc5419ab8.ttf
portfolio-admin/public/fonts/GC-EPICPRO-Demo-BF6891cc5419ab8.ttf
```

---

## Deployment

Both projects are independently deployable on Vercel.

1. Push to GitHub
2. Import each project separately on [vercel.com](https://vercel.com)
3. Set root directory to `portfolio` or `portfolio-admin`
4. Add environment variables
5. Deploy ✅

---

## Repositories

| Project | Repository |
|---|---|
| Portfolio | [portfolioWithNextJS](https://github.com/IstiakAdil14/portfolioWithNextJS) |
| Portfolio Admin | [porfolio-admin](https://github.com/IstiakAdil14/porfolio-admin) |

---

## Contact

**Md. Istiak Hussain Adil**

- 📧 [istiakadil346@gmail.com](mailto:istiakadil346@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/istiak-adil-755361329/)
- 🐙 [GitHub](https://github.com/IstiakAdil14)
- 🐦 [Twitter](https://x.com/istiakadil)

---

## License

MIT License — open source and free to use.

---

<p align="center">Made with ❤️ by <a href="https://github.com/IstiakAdil14">Adil</a></p>
