# Yogify - Yoga Studio Management Platform

A full-stack platform for yoga studios and independent yoga teachers to manage their entire business: website, scheduling, social media, students, payments, learning materials, and more.

## Features

### 1. Website Management
- Connect/host their yoga website
- Choose from professionally designed templates
- Update content (hero, about, services, testimonials)
- Embedded calendar with class schedules
- Built-in admin panel
- Social media links
- AI-assisted blog publishing

### 2. Social Media Management
- Connect Instagram and Meta accounts
- Convert raw class videos into reels (auto trim, captions, music)
- Schedule and post directly from the platform
- Available as an add-on subscription

### 3. Student CRM
- Bulk import students from WhatsApp / CSV
- Centralized student database
- Collect feedback after classes
- Automated reminders 24 hours prior to class
- Learning library: yoga videos & tutorials
- Forum with sub-communities and an AI Q&A chatbot

### 4. Remote Sessions
- Zoom & Google Meet integration
- One-click session start
- Auto-share meeting links with enrolled students

### 5. Payments
- Razorpay (India) + Stripe (international)
- One-time purchases, packages, and subscriptions
- Dashboard for revenue tracking

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Zustand |
| Backend | Node.js, Express, TypeScript, MongoDB (Mongoose) |
| Auth | JWT |
| AI | Claude (Anthropic) for blog generation & chatbot |
| Jobs | node-cron for reminders, BullMQ-ready |
| Payments | Razorpay, Stripe |
| Video | ffmpeg (reel processing) |

## Project Structure

```
CRM-Website/
├── backend/        Express + Mongoose API server
└── frontend/       React + Vite admin dashboard
```

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in secrets
npm run dev            # http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Environment Variables (backend)

See `backend/.env.example` for the full list. Required keys:
- `MONGO_URI`, `JWT_SECRET`
- `ANTHROPIC_API_KEY` (blog AI + chatbot)
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET_KEY`
- `META_APP_ID`, `META_APP_SECRET` (Instagram/Facebook)
- `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `WHATSAPP_TOKEN` (Meta Cloud API)

## License
MIT
