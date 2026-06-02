import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Button } from './ui/Button'
import { UserProfile } from './ui'
import { UserContext } from '../context/userContext.jsx'

const PremiumNavbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isAuthenticated = !!localStorage.getItem('accessToken')
  const { user, clearUser } = useContext(UserContext)
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  }, [])
  const profileUser = user || storedUser
  const avatarUrl = profileUser?.avatar?.url || profileUser?.avatar || null
  const initials = (profileUser?.fullName || profileUser?.username || profileUser?.email || 'U')
    .charAt(0)
    .toUpperCase()
  const isOnLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    clearUser?.()
    setIsOpen(false)
    navigate('/')
  }

  const navLinks = isAuthenticated
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/income', label: 'Income' },
        { href: '/expense', label: 'Expense' },
        { href: '/ai-review', label: 'AI Assistant' },
      ]
    : [
        { href: '#features', label: 'Features' },
        { href: '#how-it-works', label: 'How it works' },
        { href: '#pricing', label: 'Pricing' },
      ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-gray-900/80 backdrop-blur-lg border-b border-gray-800'
            : 'bg-white/80 backdrop-blur-lg border-b border-gray-200'
          : isDark
            ? 'bg-transparent border-b border-transparent'
            : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold"
          >
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold`}>
              ℱ
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              FinAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const isLandingLink = link.href.startsWith('#');
              
              if (isLandingLink) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? isDark
                        ? 'text-indigo-400 border-b-2 border-indigo-400'
                        : 'text-indigo-600 border-b-2 border-indigo-600'
                      : isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowProfile(true)}
                className={`hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors cursor-pointer ${
                  isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-900'
                } hover:ring-2 hover:ring-indigo-400`}
                aria-label="Open profile"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">{initials}</span>
                )}
              </button>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login">
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      isDark
                        ? 'text-white hover:bg-gray-800'
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Login
                  </button>
                </Link>
                <Link to="/signUp">
                  <button className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg bg-surface hover:bg-surface-soft dark:bg-slate-800 dark:hover:bg-slate-700`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className={`md:hidden pb-4 border-t bg-surface text-text dark:bg-slate-950 ${
              isDark ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <div className="pt-4 space-y-2">
              {isAuthenticated && (
                <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-lg font-semibold text-text">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span>{initials}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-text">{profileUser?.fullName || profileUser?.username || 'User'}</p>
                    <p className="text-sm text-muted">View profile and account options</p>
                  </div>
                </div>
              )}
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                const isLandingLink = link.href.startsWith('#');
                
                if (isLandingLink) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </a>
                  );
                }
                
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? isDark
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-indigo-100 text-indigo-600'
                        : isDark
                          ? 'text-gray-300 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setShowProfile(true)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? 'bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDark
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <button
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDark
                          ? 'border border-gray-700 text-white hover:bg-gray-800'
                          : 'border border-gray-300 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Login
                    </button>
                  </Link>
                  <Link to="/signUp" onClick={() => setIsOpen(false)}>
                    <button className="w-full px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all cursor-pointer">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </nav>
  )
}

export default PremiumNavbar
