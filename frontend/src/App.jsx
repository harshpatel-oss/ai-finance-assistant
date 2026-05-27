import './App.css'
import React from "react"
import Login from './Auth/login'
import SignUp from './Auth/signUp'
import Income from './routes/Income'
import Expense from './routes/Expense'
import Home from './routes/Home'
import AiReview from './routes/AiReview'
import Landing from './routes/PremiumLanding'
import Navbar from './components/PremiumNavbar'
import ProtectedRoute from './components/ProtectedRoute'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom"
import { User } from 'lucide-react'
import UserProvider from './context/userContext.jsx'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}


function AppContent() {
  const location = useLocation();
  // Hide navbar on landing since PremiumLanding has its own header
  const hideNavbar = location.pathname === '/';

  return (
    <div className="pt-16">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/income' element={<ProtectedRoute><Income /></ProtectedRoute>} />
        <Route path='/expense' element={<ProtectedRoute><Expense /></ProtectedRoute>} />
        <Route path="/ai-review" element={<AiReview />} />
        <Route path='/dashboard' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}


const Root = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />;
};

export default App;
