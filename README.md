# Campus Marketplace

Ultra-minimal MERN campus marketplace – list, create, and manage products with image upload.

## Features
- **Product CRUD** (title, price, description, category, images, contact)
- **Image upload** (up to 5 per product)
- **Seller dashboard** – only your products
- **Google OAuth login**
- **Email verification** (Nodemailer + Gmail App Password)

## Tech Stack
- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT + Passport Google OAuth
- **File Upload**: Multer
- **Email**: Nodemailer

## Project Structure
campus-marketplace/
├─ backend/          # Express server, routes, models
├─ frontend/         # React app (Vite)
└─ .gitignore
text## Setup

### 1. Clone & Install
```bash
git clone https://github.com/Fraol-12/campus-marketplace.git
cd campus-marketplace

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
2. Environment Variables
Create backend/.env:
envPORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_strong_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
3. Run
bash# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
Open: http://localhost:5173
Routes

GET /api/products – List products
POST /api/products – Create (auth)
GET /api/products/mine – Your products
PUT /DELETE /api/products/:id – Update/Delete (owner only)

Notes

Images served from http://localhost:5000/uploads/
.env is gitignored – never commit secrets
Use Gmail App Password (2FA required)


Built for campus trading – simple, fast, secure.