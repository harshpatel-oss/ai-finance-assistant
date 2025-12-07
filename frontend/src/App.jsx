import './App.css'
import React from "react"
import Login from './Auth/login'
import SignUp from './Auth/signUp'
import Income from './routes/Income'
import Expense from './routes/Expense'
import Home from './routes/Home'
import Navbar from './components/Navbar'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom"
import { User } from 'lucide-react'
import UserProvider from './context/userContext.jsx'

function App() {
  return (
    <UserProvider>
    <Router>
      <AppContent />
    </Router>
    </UserProvider>
  );
}


function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/signUp';

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path='/' element={<Root />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/income' element={<Income />} />
        <Route path='/expense' element={<Expense />} />
        <Route path='/dashboard' element={<Home />} />
      </Routes>
    </div>
  );
}


const Root = () => {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
