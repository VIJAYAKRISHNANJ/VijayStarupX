import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-sm">VX</span>
              </div>
              <span className="font-heading font-bold">VijayX StartupWin</span>
            </div>
            <p className="text-muted text-sm max-w-sm">
              AI-powered startup valuation predictor. Know your startup&apos;s worth in
              minutes with investor-grade analysis.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link to="/predict" className="hover:text-primary transition-colors">
                  Predict Valuation
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>Product Owner: Vijay Krishnan</li>
              <li>Version 1.0</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border text-center text-sm text-muted">
          © {new Date().getFullYear()} VijayX StartupWin. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
