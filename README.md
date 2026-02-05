# 🏆 Achievement Web

A modern full-stack web application for tracking personal achievements, skills, goals, and celebrating your journey.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

---

## ✨ Features

### **Achievement Management**
- 📝 Create, edit, and delete achievements
- 🎯 Set importance levels (1-5 stars)
- 🌐 Public/Private visibility control
- 🏷️ Category organization
- 🔍 Search and filter
- 📊 Grid and list views

### **Skills Tracking**
- 🎓 Track skill proficiency (0-100%)
- 📈 Visual progress bars
- 🏷️ Category grouping
- 📊 Progress monitoring

### **Goals Management**
- ✅ Kanban-style board (Not Started, In Progress, Completed)
- 🎯 Target date tracking
- 📊 Progress percentage
- 📝 Detailed descriptions

### **Visualizations**
- ⏱️ Interactive timeline view
- 📊 Analytics dashboard with charts
- 📈 Yearly and monthly breakdowns
- 🎯 KPI metrics

### **User Experience**
- 🎨 Beautiful glassmorphism design
- 📱 Fully responsive (mobile/tablet/desktop)
- 🚀 Fast and modern UI
- 🌈 Purple/Blue gradient theme
- ✨ Smooth animations

---

## 🚀 Quick Start

### **Prerequisites**
- Python 3.11+ (or 3.13 with compatibility fixes)
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### **Backend Setup**

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the server**
   ```bash
   uvicorn app.main:app --reload
   ```
   
   Backend will be available at: http://localhost:8000
   API docs at: http://localhost:8000/docs

### **Frontend Setup**

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (if needed)
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at: http://localhost:3000

---

## 📁 Project Structure

```
Achievement_Web/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── achievements.py
│   │   │   ├── categories.py
│   │   │   ├── skills.py
│   │   │   └── goals.py
│   │   ├── core/              # Configuration
│   │   ├── crud/              # Database operations
│   │   ├── db/                # Database setup
│   │   ├── models/            # SQLAlchemy models
│   │   └── schemas/           # Pydantic schemas
│   ├── alembic/               # Database migrations
│   └── requirements.txt
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Next.js 14 App Router
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── login/                # Login page
│   │   │   ├── register/             # Registration
│   │   │   ├── dashboard/            # Main dashboard
│   │   │   ├── achievements/         # Achievements CRUD
│   │   │   ├── categories/           # Categories
│   │   │   ├── skills/               # Skills
│   │   │   ├── goals/                # Goals
│   │   │   ├── timeline/             # Timeline view
│   │   │   ├── analytics/            # Analytics
│   │   │   ├── profile/              # User profile
│   │   │   └── about/                # About page
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # API client (Axios)
│   │   ├── stores/            # Zustand state
│   │   └── types/             # TypeScript types
│   └── package.json
│
└── README.md                   # This file
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React

### **Backend**
- **Framework:** FastAPI
- **ORM:** SQLAlchemy 2.0
- **Database:** PostgreSQL
- **Migrations:** Alembic
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt

---

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

### **Main Endpoints**

#### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

#### **Achievements**
- `GET /api/achievements/` - List all achievements
- `POST /api/achievements/` - Create achievement
- `GET /api/achievements/{id}` - Get achievement detail
- `PUT /api/achievements/{id}` - Update achievement
- `DELETE /api/achievements/{id}` - Delete achievement

#### **Categories**
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category

#### **Skills**
- `GET /api/skills/` - List skills
- `POST /api/skills/` - Create skill
- `DELETE /api/skills/{id}` - Delete skill

#### **Goals**
- `GET /api/goals/` - List goals
- `POST /api/goals/` - Create goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

---

## 🎨 Screenshots

### Homepage
Beautiful landing page with features showcase and quick navigation.

### Dashboard
Main hub showing achievement statistics, recent achievements, and quick actions.

### Achievements List
Grid/List view with search, filters, and sorting options.

### Timeline View
Interactive chronological display of achievements with year filtering.

### Analytics
Comprehensive statistics with charts showing yearly and monthly breakdowns.

---

## 🧪 Testing

### **Manual Testing**
1. Register a new account
2. Create your first achievement
3. Try all CRUD operations
4. Test search and filters
5. Explore timeline and analytics
6. Update your profile

### **Test Credentials** (Development)
```
Email: demo@example.com
Password: demo123
```

---

## 🚢 Deployment

### **Backend (Railway/Render)**
1. Set environment variables
2. Configure PostgreSQL database
3. Run migrations
4. Deploy

### **Frontend (Vercel)**
1. Connect GitHub repository
2. Configure build commands
3. Set environment variables
4. Deploy

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

Built with ❤️ for tracking achievements and celebrating progress.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- FastAPI team for the high-performance backend
- Tailwind CSS for beautiful styling
- All open source contributors

---

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with** ❤️ **and** ☕

Start tracking your achievements today! 🏆✨
