# Cloud Storage (Google Drive Style) - Full Stack Project

## 📌 Project Overview
This is a full-stack Cloud Storage application inspired by Google Drive.
Users can login and manage their uploaded files with features like upload, preview, download, rename, sorting, search, trash and restore.

## 📌 GitHub Repositories

- **Frontend Repo:** https://github.com/romasanyal05/cloud-storage-frontend
- **Backend Repo:** -
 https://github.com/romasanyal05/cloud-storage-backend

DEMO VIDEO DRIVE LINK
https://drive.google.com/file/d/1Mn4jk8n2QT4oCKoowyp2R-zHWI0TKc16/view?usp=drivesdk

---

## ✅ Features Implemented

### 🔐 Authentication
- Login with token-based authentication (JWT)
- Protected routes (Dashboard only accessible after login)
- Logout functionality

### 📁 File Management
- Upload files
- Drag & Drop file upload
- Upload progress bar
- List uploaded files with details (name, type, size)
- Preview files (PDF/Image) using modal
- Open file in new tab
- Download file using signed URL
- Rename file
- Trash (soft delete) files

### 🗑️ Trash Module
- View trashed files
- Restore trashed files
- Delete permanently

### 🔍 Search & Sorting
- Sorting options:
  - A-Z
  - Z-A
  - Latest
  - Oldest
- Search bar to filter files quickly

### 💳 Payments (Stripe One-time Checkout)
- Premium/Upgrade button added
- Stripe Checkout session creation
- Payment success & cancel pages

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- Stripe API
- Supabase Storage
- JWT Auth

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <your-github-repo-link>
cd cloud-storage
2️⃣ Backend Setup
cd backend
npm install
node index.js
Create .env in backend:
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://hchijoqgslckaidiorpc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaGlqb3Fnc2xja2FpZGlvcnBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MTEwOTgsImV4cCI6MjA4MzI4NzA5OH0.2Ipt0QZZ1iF5p5-VjVHZplrsGCQR4mTlDp_M9NyocjM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjaGlqb3Fnc2xja2FpZGlvcnBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzcxMTA5OCwiZXhwIjoyMDgzMjg3MDk4fQ.c5HJKNslOclEfEtV6Ocz5DLRN44lHdmo1uQ-csh6UMg
STRIPE_SECRET_KEY=sk_test_51SrJCAAt9b3elU0dpcderv4rQvIIbqLG2fLN4AcNYrMHdTPntp8kl67v7GvdC36urvS4iRFynMOei1Po5xf5FepY00EsER0Oxq
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
Create .env in frontend:
VITE_API_BASE_URL=http://localhost:5000


📸 Screenshots
Screenshots are available in the screenshots/ folder.

### ✅ Login Page
![Login](./screenshots/login.png)

### ✅ Dashboard Page
![Dashboard](./screenshots/dashboard.png)

### ✅ Upload Progress Bar
![Upload Progress](./screenshots/upload-progress.png)

### ✅ Preview Modal (PDF/Image Preview)
![Preview Modal](./screenshots/preview-modal.png)

### ✅ Trash Page (Restore / Delete Forever)
![Trash Page](./screenshots/trash-page.png)
### ✅ Upgrade / Premium Button + Stripe Checkout
![Upgrade Button](./screenshots/upgrade-button.png)

### ✅ Stripe Checkout Page (₹199 One-time Payment)
![Stripe Checkout](./screenshots/stripe-checkout.png)

## ER Diagram
![ER Diagram](./screenshots/er-diagram.png)

✅ Demo Video
Record a 3–5 minute demo video showing all features:
Login
Upload / Drag Drop
Sorting + Search
Preview modal
Trash + Restore
Stripe checkout flow

##Future Work
Deployment
👩‍💻 Author
Garima Bhushan
