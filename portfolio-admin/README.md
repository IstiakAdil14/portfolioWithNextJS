# Portfolio Admin Dashboard

A modern, secure admin panel for managing portfolio content with real-time sync capabilities. Built with Next.js 15, TypeScript, and MongoDB.

## Features

- 🔐 **Secure Authentication** - Password-protected admin access with session management
- 🎨 **Modern UI** - Glassmorphism design with custom cursor and smooth animations
- 📊 **Dashboard** - Manage projects, skills, and expertise sections
- ⚡ **Real-time Sync** - Changes reflect instantly on your portfolio site
- 🎭 **EPIC PRO Font** - Bold, impactful typography for headings
- 🌊 **Liquid Background** - Animated gradient effects with orbs
- 📱 **Responsive** - Optimized for all screen sizes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Custom session-based auth

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- EPIC PRO font file (place in `public/fonts/`)

### Installation

```bash
# Clone the repository
git clone https://github.com/IstiakAdil14/porfolio-admin.git
cd portfolio-admin

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the admin panel.

## Project Structure

```
portfolio-admin/
├── app/
│   ├── api/          # API routes
│   ├── dashboard/    # Dashboard pages
│   ├── login/        # Login page
│   └── globals.css   # Global styles
├── components/
│   ├── dashboard/    # Dashboard components
│   ├── login/        # Login UI components
│   └── CustomCursor.tsx
├── lib/
│   ├── auth.ts       # Authentication logic
│   └── mongodb.ts    # Database connection
└── public/
    └── fonts/        # EPIC PRO font files
```

## Key Components

### Login Page
- **LeftPanel**: Branding, features showcase, stats
- **RightPanel**: Password input with glassmorphism card
- **LiquidBackground**: Animated gradient with floating orbs
- **CustomCursor**: Interactive cursor with magnetic effects

### Dashboard
- Projects management
- Skills & technologies editor
- Expertise sections control
- Live preview sync

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Manual Deployment

```bash
npm run build
npm start
```

## Font Setup

This project uses **EPIC PRO** font. Place the font file in `public/fonts/`:

```
public/fonts/GC-EPICPRO-Demo-BF6891cc5419ab8.ttf
```

The font is configured in `app/globals.css` with `@font-face`.

## License

MIT License - feel free to use for your own portfolio!

## Links

- **Live Demo**: [Your deployed URL]
- **Portfolio Site**: [Your portfolio URL]
- **GitHub**: [https://github.com/IstiakAdil14/porfolio-admin](https://github.com/IstiakAdil14/porfolio-admin)
