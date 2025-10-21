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

// ✅ App wrapper
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// ✅ Inside Router so we can use useLocation
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

// ✅ Redirects based on auth status
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;
