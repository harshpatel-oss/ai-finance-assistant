# Finance Assistant - Full-Stack Expense Tracker

A modern, AI-powered personal finance management application built with React, Express.js, and MongoDB. Track income and expenses, analyze spending patterns, and get AI-powered financial insights with a beautiful, responsive UI.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Income Tracking**: Add, view, and manage income sources with emoji icons
- **Expense Tracking**: Categorize and track expenses with visual icons
- **Dashboard Analytics**: Comprehensive financial overview with charts and statistics
- **AI Financial Assistant**: Get personalized financial advice powered by Google Gemini AI
- **Data Export**: Download financial data as Excel files
- **Responsive Design**: Modern UI that works on all devices

### Technical Features
- **Real-time Updates**: Live dashboard with recent transactions
- **Data Visualization**: Interactive charts for income/expense analysis
- **File Upload**: Avatar management with Cloudinary integration
- **Error Handling**: Comprehensive error management and user feedback
- **Security**: Password hashing, JWT authentication, and secure cookies

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icon library
- **Emoji Picker React** - Emoji selection for categories
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token for authentication
- **bcrypt** - Password hashing
- **Google Gemini AI** - AI-powered financial insights
- **Cloudinary** - Cloud file storage for avatars
- **XLSX** - Excel file generation

## 📁 Project Structure

```
finance-assistant/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── index.js              # Server entry point
│   │   ├── constant.js           # Application constants
│   │   ├── controllers/          # Route handlers
│   │   │   ├── user.controller.js
│   │   │   ├── income.controller.js
│   │   │   ├── expense.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── ai.controller.js
│   │   ├── models/               # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── income.model.js
│   │   │   └── expense.model.js
│   │   ├── routes/               # API route definitions
│   │   │   ├── user.routes.js
│   │   │   ├── income.routes.js
│   │   │   ├── expense.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── ai.routes.js
│   │   ├── middlewares/          # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   └── multer.middleware.js
│   │   ├── services/             # Business logic services
│   │   │   └── ai.service.js
│   │   ├── utils/                # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── cloudinary.js
│   │   └── db/                   # Database connection
│   │       └── index.js
│   ├── package.json
│   └── Readme.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # App entry point
│   │   ├── App.css               # Global styles
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── StatCard.jsx
│   │   │   │   └── Transactions.jsx
│   │   │   └── Navbar.jsx        # Navigation with dark mode
│   │   ├── Auth/                 # Authentication components
│   │   │   ├── login.jsx
│   │   │   └── signUp.jsx
│   │   ├── context/              # React context
│   │   │   └── userContext.jsx
│   │   ├── routes/               # Page components
│   │   │   ├── Home.jsx          # Dashboard
│   │   │   ├── Income.jsx        # Income tracking
│   │   │   ├── Expense.jsx       # Expense tracking
│   │   │   └── AiReview.jsx      # AI chat interface
│   │   ├── utils/                # Utility functions
│   │   │   ├── apiPaths.js
│   │   │   └── axiosInstance.js
│   │   └── assets/               # Static assets
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── README.md
└── README.md                      # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/expense_tracker_db
   PORT=8000
   CORS_ORIGIN=http://localhost:5173

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Google Gemini AI
   GOOGLE_GEMINI_KEY=your_google_gemini_api_key
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `GET /api/v1/users/current-user` - Get current user info

### Income Management
- `POST /api/v1/income/add` - Add new income
- `GET /api/v1/income/get` - Get all incomes
- `DELETE /api/v1/income/delete/:incomeId` - Delete income
- `GET /api/v1/income/download-excel` - Download income data as Excel

### Expense Management
- `POST /api/v1/expense/add` - Add new expense
- `GET /api/v1/expense/get` - Get all expenses
- `DELETE /api/v1/expense/delete/:expenseId` - Delete expense
- `GET /api/v1/expense/download-excel` - Download expense data as Excel

### Dashboard
- `GET /api/v1/dashboard` - Get dashboard analytics

### AI Assistant
- `POST /api/v1/ai/ai-assistant` - Get AI-powered financial insights

## 🎨 UI Components

The application features a comprehensive component library:

### Card Components
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./components/ui/Card";

<Card hover variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer here</CardFooter>
</Card>
```

### Button Component
```jsx
import { Button } from "./components/ui/Button";

<Button
  variant="primary"      // primary | secondary | outline | danger | ghost
  size="md"              // sm | md | lg | full
  loading={false}
  onClick={() => {}}
>
  Click Me
</Button>
```

### Input Components
```jsx
import { Input, TextArea, Select } from "./components/ui/Input";

<Input
  label="Email"
  name="email"
  type="email"
  error="Invalid email"
  placeholder="you@example.com"
/>
```

### StatCard with Animation
```jsx
import { StatCard } from "./components/ui/StatCard";
import { DollarSign } from "lucide-react";

<StatCard
  icon={DollarSign}
  label="Total Balance"
  value={5000}
  prefix="₹"
  trend="12%"
  isPositive={true}
/>
```

## 📄 Page Components

### 1. Dashboard (`Home.jsx`)
- Animated stat cards with counter animations
- Income & expense trend charts (Area Chart)
- Income vs Expense distribution (Pie Chart)
- Quick stats and insights
- Recent transactions list
- Fully responsive grid layout

### 2. Expense Tracking (`Expense.jsx`)
- Add/edit/delete expenses with emoji picker
- Expense trend chart (last 14 days)
- Category distribution progress bars
- Search and filter functionality
- Download as Excel
- Beautiful expense list with icons

### 3. Income Tracking (`Income.jsx`)
- Add/edit/delete income sources with emoji picker
- Income trend visualization
- Income source distribution
- Search and filter
- Excel export
- Green color scheme

### 4. AI Assistant Chat (`AiReview.jsx`)
- ChatGPT-like interface
- Suggested questions
- Copy-to-clipboard functionality
- Typing animations
- Error handling
- Responsive chat layout

## 🤖 AI Features

The AI Financial Assistant provides:
- **Personalized Insights**: Analysis based on your financial data
- **Spending Pattern Recognition**: Identify trends and anomalies
- **Budget Recommendations**: Actionable advice for better financial health
- **Risk Assessment**: Highlight potential financial concerns
- **Goal Setting**: Help with financial planning

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured cross-origin resource sharing
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error responses without data leakage

## 📊 Data Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String, // hashed
  avatar: String, // Cloudinary URL
  refreshToken: String
}
```

### Income Model
```javascript
{
  userId: ObjectId,
  icon: String, // emoji
  source: String,
  amount: Number,
  date: Date
}
```

### Expense Model
```javascript
{
  userId: ObjectId,
  icon: String, // emoji
  category: String,
  amount: Number,
  date: Date
}
```

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Deploy to services like Heroku, Railway, or Vercel

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy to services like Vercel, Netlify, or GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for better financial management**

