import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, PieChart, Zap, MessageSquare, Check, Star, ChevronDown, Menu, X } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const PremiumLanding = () => {
  const { isDark } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isAuthenticated = !!localStorage.getItem('accessToken')

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Smart Expense Tracking',
      description: 'Track your spending habits with real-time insights and detailed categorization.',
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: 'Beautiful Analytics',
      description: 'Visualize your financial data with interactive charts and comprehensive reports.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Assistant',
      description: 'Get personalized financial advice powered by cutting-edge AI technology.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'Smart Conversations',
      description: 'Chat with our AI to understand your spending patterns and improve your finances.',
    },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Freelancer',
      avatar: '👩‍💼',
      quote: 'FinAI helped me understand where my money goes. I saved $300 this month just by tracking expenses!',
    },
    {
      name: 'Alex Rodriguez',
      role: 'Software Engineer',
      avatar: '👨‍💻',
      quote: 'The AI assistant feature is incredible. It gives personalized insights I never would have discovered.',
    },
    {
      name: 'Emma Wilson',
      role: 'Startup Founder',
      avatar: '👩‍🚀',
      quote: 'Finally, a finance app that actually understands my business expenses. Highly recommended!',
    },
  ]

  const faqs = [
    {
      question: 'How secure is my financial data?',
      answer: 'We use enterprise-grade encryption (AES-256) for all data transmission and storage. Your financial information is protected with the same security standards used by major banks.',
    },
    {
      question: 'Can I connect my bank account directly?',
      answer: 'Currently, we support manual expense entry and transaction imports. Direct bank connections are coming in Q2 2024.',
    },
    {
      question: 'Is there a free plan?',
      answer: 'Yes! Start with our free plan that includes basic expense tracking, analytics, and limited AI assistant conversations.',
    },
    {
      question: 'How accurate is the AI advice?',
      answer: 'Our AI analyzes millions of financial patterns and provides recommendations based on your specific spending habits and income.',
    },
  ]

  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="min-h-screen transition-colors duration-300 bg-surface text-text dark:bg-slate-950 dark:text-white">
      {/* Header with Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-lg border-b border-surface dark:bg-slate-950/80 dark:border-slate-800'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              ℱ
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              FinAI
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className={`text-sm font-medium transition-colors ${isDark ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}>
              Features
            </a>
            <a href="#testimonials" className={`text-sm font-medium transition-colors ${isDark ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}>
              Testimonials
            </a>
            <a href="#pricing" className={`text-sm font-medium transition-colors ${isDark ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}>
              Pricing
            </a>
            <a href="#faq" className={`text-sm font-medium transition-colors ${isDark ? 'hover:text-indigo-400' : 'hover:text-indigo-600'}`}>
              FAQ
            </a>
          </div>

          {/* Auth CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg font-medium transition-colors hover:bg-surface-soft dark:hover:bg-slate-800">
                  Login
                </Link>
                <Link to="/signUp" className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-500/10'} blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full ${isDark ? 'bg-purple-600/20' : 'bg-purple-500/10'} blur-3xl animate-pulse`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 w-fit">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-600">AI-Powered Finance</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Smart Money,{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Better Life
                </span>
              </h1>

              <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Take control of your finances with AI-powered insights. Track expenses, analyze spending patterns, and make smarter financial decisions in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to={isAuthenticated ? '/dashboard' : '/signUp'} className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-indigo-500/40 transition-all">
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className={`flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold border transition-colors ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
                  Learn More
                </Link>
              </div>

              <div className="flex gap-6 pt-4">
                <div>
                  <p className="text-2xl font-bold">10K+</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">$50M+</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tracked Monthly</p>
                </div>
              </div>
            </div>

            {/* Right - Dashboard Preview */}
            <div className={`relative aspect-square rounded-2xl p-6 border backdrop-blur-sm ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}`}>
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <PieChart className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-xl font-semibold">Analytics Dashboard</p>
                  <p className="text-sm opacity-75">Real-time expense tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to master your finances
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border transition-all hover:shadow-lg ${
                  isDark
                    ? 'border-gray-800 hover:border-indigo-500/50 bg-gray-900/50'
                    : 'border-gray-200 hover:border-indigo-500/50 bg-gray-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section className={`py-20 border-t ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">AI Financial Advisor</h2>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Chat with our intelligent assistant to get personalized financial advice, understand your spending patterns, and receive actionable recommendations to improve your financial health.
              </p>
              <ul className="space-y-3">
                {['Personalized insights', 'Real-time analysis', 'Smart recommendations', 'Natural conversations'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-indigo-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`aspect-square rounded-2xl border backdrop-blur-sm flex items-center justify-center ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'}`}>
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-indigo-600 opacity-80" />
                <p className="text-xl font-semibold">Chat with AI</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Get instant financial advice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={`py-20 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Users</h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Join thousands of people improving their financial health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl border ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50/50'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>&quot;{testimonial.quote}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className={`py-20 border-t ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Free', price: '0', features: ['Basic expense tracking', 'Monthly reports', 'Limited AI chat', '1 user'] },
              { name: 'Pro', price: '9.99', features: ['Unlimited tracking', 'Advanced analytics', 'Unlimited AI chat', 'Multi-currency', '24/7 support'], highlight: true },
              { name: 'Enterprise', price: 'Custom', features: ['Everything in Pro', 'Team management', 'API access', 'Custom integrations', 'Dedicated support'] },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-xl border ${
                  plan.highlight
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 md:scale-105'
                    : isDark
                      ? 'border-gray-800 bg-gray-900/50'
                      : 'border-gray-200 bg-white/50'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-sm text-gray-500">/month</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 rounded-lg font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                      : isDark
                        ? 'border border-gray-700 hover:bg-gray-800'
                        : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {isAuthenticated ? 'Upgrade' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={`py-20 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`p-6 rounded-xl border cursor-pointer transition-all ${isDark ? 'border-gray-800 hover:border-indigo-500/50' : 'border-gray-200 hover:border-indigo-500/50'}`} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === i && <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 border-t ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Take Control?</h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start managing your finances smarter today. No credit card required.
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/signUp'}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-2xl hover:shadow-indigo-500/40 transition-all"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Features</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Pricing</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>About</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Blog</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Twitter</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>LinkedIn</a></li>
                <li><a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t flex items-center justify-between ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 FinAI. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</a>
              <a href="#" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PremiumLanding
