import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Sparkles } from 'lucide-react'

const Feature = ({ title, desc }) => (
  <div className="bg-surface rounded-2xl p-6 shadow-sm border border-surface">
    <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
    <p className="text-sm text-muted">{desc}</p>
  </div>
)

const Testimonial = ({ name, text }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm border border-surface">
    <p className="text-text">“{text}”</p>
    <p className="mt-3 text-sm font-medium text-muted">— {name}</p>
  </div>
)

const Landing = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <div className="min-h-screen bg-surface text-text">
      <header className="py-6 border-b border-surface">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">💰</div>
            <div>
              <h1 className="text-xl font-bold">AI Finance</h1>
              <p className="text-xs text-gray-500">Smarter finances, powered by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signUp"><Button>Sign up</Button></Link>
              </>
            ) : (
              <Link to="/dashboard"><Button>Go to Dashboard</Button></Link>
            )}
          </div>
        </div>
      </header>

      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">Your personal finance assistant</h2>
              <p className="mt-4 text-gray-600 max-w-xl">Get personalized budgeting, expense analysis, and saving recommendations using AI — all in one beautiful dashboard.</p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {!isAuthenticated ? (
                  <Link to="/signUp"><Button className="px-6 py-3">Get started</Button></Link>
                ) : (
                  <Link to="/dashboard"><Button className="px-6 py-3">Open Dashboard</Button></Link>
                )}
                <Link to="/ai-review"><Button variant="ghost" className="px-6 py-3">Try AI Assistant</Button></Link>
              </div>
            </div>

            <div>
              <div className="bg-surface rounded-2xl p-6 shadow-lg border border-surface">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl"><Sparkles /></div>
                  <div>
                    <p className="text-sm text-muted">Live demo</p>
                    <h3 className="font-semibold text-text">AI-driven insights</h3>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-40 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400">[Chart preview]</div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-16">
            <h3 className="text-2xl font-semibold mb-6">Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Feature title="Automated Budgeting" desc="Create smart budgets based on your spending patterns." />
              <Feature title="Expense Insights" desc="Visualize where your money goes with AI-curated reports." />
              <Feature title="Savings Goals" desc="Set and track goals with personalized tips." />
            </div>
          </section>

          <section className="mt-16">
            <h3 className="text-2xl font-semibold mb-6">What customers say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Testimonial name="Aisha" text="Saved 20% monthly after using the recommendations." />
              <Testimonial name="Ben" text="The AI assistant helped me find recurring subscriptions I forgot about." />
              <Testimonial name="Carlos" text="Beautiful UI and clear insights — highly recommended." />
            </div>
          </section>

          <section className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold">Ready to take control of your finances?</h3>
              <p className="mt-3">Sign up and get a 14-day free trial with premium features.</p>
                <div className="mt-6 flex justify-center gap-3">
                  {!isAuthenticated ? (
                    <Link to="/signUp"><Button className="bg-white text-indigo-600">Start free trial</Button></Link>
                  ) : (
                    <Link to="/dashboard"><Button className="bg-white text-indigo-600">Open Dashboard</Button></Link>
                  )}
                  <Link to="/ai-review"><Button variant="ghost" className="border-white/30 text-white">Try demo</Button></Link>
                </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} AI Finance. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
    