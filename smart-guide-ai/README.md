# 🤖 Smart Guide AI

**AI-Powered Digital Service Learning & Assistance Platform**

Helps Indian citizens apply for government services (Income Certificate, Caste Certificate, Pension, etc.) with step-by-step AI guidance, multi-language support, and real-time application tracking.

---

## 📁 Project Structure

```
smart-guide-ai/
├── client/                     # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/           # AI ChatBot widget
│   │   │   ├── dashboard/      # ServiceCard
│   │   │   ├── forms/          # StepWizard, DocumentUpload
│   │   │   └── layout/         # Navbar, Footer, Layout
│   │   ├── pages/              # LandingPage, Dashboard, ServiceDetail, etc.
│   │   ├── services/           # Axios API layer
│   │   ├── store.js            # Zustand state (auth, theme, language, progress)
│   │   └── utils/              # i18n translations, mock data
│   ├── Dockerfile
│   └── nginx.conf
├── server/                     # Node.js + Express backend
│   ├── controllers/            # authController, servicesController, etc.
│   ├── middleware/             # authMiddleware, errorMiddleware
│   ├── models/                 # User, Service, Application (Mongoose)
│   ├── routes/                 # auth, services, applications, chat, upload
│   ├── utils/                  # db.js, jwt.js, seed.js
│   └── Dockerfile
├── .github/workflows/          # GitHub Actions CI/CD
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB** v6+ running locally OR use Docker
- **Git**

### 1 — Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/smart-guide-ai.git
cd smart-guide-ai

# Install all dependencies (root + client + server)
npm run install:all
```

### 2 — Configure environment

```bash
# Root .env (for server)
cp .env.example .env

# Edit .env — at minimum set:
#   MONGODB_URI=mongodb://localhost:27017/smart-guide-ai
#   JWT_SECRET=any_long_random_string_here

# Client .env (optional — defaults to proxy)
echo "VITE_API_URL=/api" > client/.env
```

### 3 — Seed the database

```bash
cd server
npm run seed
# Creates 6 services + demo user: demo@smartguide.ai / Demo@1234
cd ..
```

### 4 — Run in development

```bash
# Starts both frontend (port 3000) and backend (port 5000) concurrently
npm run dev
```

Open **http://localhost:3000** — the Vite proxy forwards `/api/*` to Express.

---

## 🐳 Docker Compose (Recommended)

Runs MongoDB + Backend + Frontend in isolated containers.

```bash
# 1. Copy env file
cp .env.example .env
# Edit .env — set JWT_SECRET at minimum

# 2. Build & start all services
docker compose up --build

# 3. Seed the database (first run only)
docker compose exec backend node utils/seed.js

# 4. Open the app
# Frontend → http://localhost:3000
# Backend  → http://localhost:5000
# API docs → http://localhost:5000/api/health
```

### Stop & clean up

```bash
docker compose down           # stop containers
docker compose down -v        # stop + remove volumes (resets DB)
```

---

## 🔑 Demo Credentials

| Email                   | Password    | Role  |
|-------------------------|-------------|-------|
| demo@smartguide.ai      | Demo@1234   | User  |

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint              | Auth | Description              |
|--------|-----------------------|------|--------------------------|
| POST   | `/auth/register`      | ❌   | Create new account       |
| POST   | `/auth/login`         | ❌   | Login, receive JWT       |
| GET    | `/auth/me`            | ✅   | Get current user profile |
| PATCH  | `/auth/me`            | ✅   | Update profile           |

**Register / Login body:**
```json
{
  "name": "Ravi Kumar",
  "email": "ravi@example.com",
  "password": "Ravi@1234"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "_id": "...", "name": "Ravi Kumar", "email": "ravi@example.com" }
}
```

---

### Services

| Method | Endpoint                   | Auth | Description               |
|--------|----------------------------|------|---------------------------|
| GET    | `/services`                | ❌   | List all services         |
| GET    | `/services?category=Certificates` | ❌ | Filter by category   |
| GET    | `/services?popular=true`   | ❌   | Get popular services      |
| GET    | `/services?search=income`  | ❌   | Search services           |
| GET    | `/services/slug/:slug`     | ❌   | Get by slug               |
| GET    | `/services/:id`            | ❌   | Get by MongoDB ID         |

---

### Applications

| Method | Endpoint                   | Auth | Description               |
|--------|----------------------------|------|---------------------------|
| POST   | `/applications`            | ✅   | Submit new application    |
| GET    | `/applications/my`         | ✅   | Get my applications       |
| GET    | `/applications/:id`        | ✅   | Get application by ID     |
| PATCH  | `/applications/:id`        | ✅   | Update application        |
| DELETE | `/applications/:id`        | ✅   | Delete application        |

**Submit application body:**
```json
{
  "serviceId":   "s1",
  "serviceName": "Income Certificate",
  "serviceSlug": "income-certificate",
  "formData": {
    "fullName":     "Ravi Kumar",
    "dob":          "1990-05-12",
    "aadhaar":      "123456789012",
    "address":      "123 Main St, Chennai",
    "annualIncome": 180000,
    "occupation":   "Software Engineer"
  }
}
```

---

### AI Chat

| Method | Endpoint  | Auth | Description               |
|--------|-----------|------|---------------------------|
| POST   | `/chat`   | ❌   | Send message to AI        |

**Body:**
```json
{
  "message": "How to apply for income certificate?",
  "history": [],
  "lang": "en"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "**Income Certificate — Step-by-Step Guide**\n\n1. ...",
  "source": "mock"
}
```

---

### File Upload

| Method | Endpoint   | Auth | Description               |
|--------|------------|------|---------------------------|
| POST   | `/upload`  | ✅   | Upload documents (max 5)  |

**Form data:** `files` (multipart) — PDF, JPG, PNG, max 2 MB each

---

## 🌐 Frontend Pages

| Route              | Page              | Auth Required |
|--------------------|-------------------|---------------|
| `/`                | Landing Page      | No            |
| `/services`        | Services Catalog  | No            |
| `/services/:slug`  | Service Detail    | No            |
| `/login`           | Login             | No            |
| `/register`        | Register          | No            |
| `/dashboard`       | User Dashboard    | Yes           |
| `/apply/:slug`     | Application Form  | Yes           |
| `/track/:id`       | Application Track | Yes           |

---

## 🌍 Multi-Language Support

Toggle language from the navbar globe icon.

| Code | Language | Status   |
|------|----------|----------|
| `en` | English  | ✅ Full  |
| `ta` | தமிழ்    | ✅ Full  |
| `hi` | हिंदी    | ✅ Full  |

---

## 🚀 Deployment

### Option A — Render (Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service

**Backend:**
- Root directory: `server`
- Build command: `npm install`
- Start command: `node index.js`
- Environment variables: Copy from `.env.example`

**Frontend:**
- Root directory: `client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Set `VITE_API_URL=https://your-backend.onrender.com/api`

**MongoDB:** Use [MongoDB Atlas](https://cloud.mongodb.com) free cluster → set `MONGODB_URI`

---

### Option B — Vercel (Frontend) + Railway (Backend)

**Frontend → Vercel:**
```bash
cd client
npx vercel --prod
# Set env: VITE_API_URL=https://your-railway-backend.railway.app/api
```

**Backend → Railway:**
```bash
# Connect GitHub repo → set root directory to /server
# Add environment variables in Railway dashboard
```

---

### Option C — AWS EC2

```bash
# 1. SSH into your EC2 instance
ssh -i key.pem ec2-user@YOUR_EC2_IP

# 2. Install Docker & Compose
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Clone & deploy
git clone https://github.com/YOUR_USERNAME/smart-guide-ai.git
cd smart-guide-ai
cp .env.example .env
# Edit .env with production values

docker-compose up --build -d
docker-compose exec backend node utils/seed.js
```

---

## 🔧 VS Code — Run Commands

Open integrated terminal (`Ctrl + `` ` ``):

```bash
# Terminal 1 — Install everything
npm run install:all

# Terminal 2 — Run dev server (both frontend + backend)
npm run dev

# Terminal 3 — Seed database
cd server && npm run seed

# Build for production
npm run build
```

**Recommended VS Code extensions:**
- ESLint
- Tailwind CSS IntelliSense
- Prettier
- REST Client (for API testing)
- MongoDB for VS Code

---

## 🔒 Security Notes

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- Helmet.js sets secure HTTP headers
- Rate limiting: 100 req/15min (API), 20 req/min (chat)
- File upload: type validation + 2 MB size limit
- CORS restricted to allowed origins
- MongoDB injection prevented by Mongoose schema validation

---

## 📦 Tech Stack Summary

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Zustand   |
| Routing    | React Router v6                         |
| Forms      | React Hook Form                         |
| HTTP       | Axios                                   |
| Backend    | Node.js, Express.js                     |
| Database   | MongoDB, Mongoose                       |
| Auth       | JWT (jsonwebtoken) + bcryptjs           |
| AI         | OpenAI GPT-3.5 (+ mock fallback)        |
| Upload     | Multer                                  |
| Docker     | Docker + Docker Compose                 |
| CI/CD      | GitHub Actions                          |
| Web Server | Nginx (frontend container)              |

---

## 📄 License

MIT © 2024 Smart Guide AI
