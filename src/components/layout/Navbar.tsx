import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/Button'

export function Navbar() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center red-glow">
            <span className="font-heading font-bold text-sm">VX</span>
          </div>
          <span className="font-heading font-bold text-lg">
            VijayX <span className="text-primary">StartupWin</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
          {isLanding && (
            <>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
            </>
          )}
        </nav>

        <Link to="/predict">
          <Button size="sm">Start Prediction</Button>
        </Link>
      </div>
    </header>
  )
}
