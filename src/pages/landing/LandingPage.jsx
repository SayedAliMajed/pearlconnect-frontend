import { Link } from 'react-router';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                alt="PearlConnect Logo"
                className="h-8 w-auto"
                src="/img/logo.png"
              />
              <span className="text-xl font-bold text-gray-900">PearlConnect</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/sign-up" className="text-gray-700 hover:text-teal-600 transition">
                Become a Pro
              </Link>
            </nav>
            <Link to="/sign-in">
              <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-900 transition">
                Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome to PearlConnect Bahrain
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Connect with trusted local professionals for all your service needs across Bahrain.
              </p>
              <div className="space-x-4">
                <Link to="/sign-up">
                  <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Get Started
                  </button>
                </Link>
                <Link to="/services">
                  <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
                    Find Services
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose PearlConnect?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We make it easy to find and connect with skilled professionals in your community.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Providers</h3>
                <p className="text-gray-600">All professionals are vetted and verified for quality service.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">Safe and convenient payment processing for all services.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 9.5a3 3 0 01-6 1.663.75.75 0 01-.75-1.25A4.5 4.5 0 1113 10.75 1 1 0 0114 10zm-5 3a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Local Bahrain support team available to help anytime.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Popular Services in Bahrain
              </h2>
              <p className="text-lg text-gray-600">
                Find professionals for the most common services in your area.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Home Maintenance', icon: '🔧', category: 'Plumbing', desc: 'Plumbing, electrical, repairs' },
                { name: 'Cleaning Services', icon: '🧹', category: 'Cleaning', desc: 'Home and office cleaning' },
                { name: 'Tutoring', icon: '📚', category: 'Tutoring', desc: 'Academic support services' },
                { name: 'Landscaping', icon: '🌳', category: 'Landscaping', desc: 'Garden and outdoor services' },
                { name: 'Painting', icon: '🖌️', category: 'Painting', desc: 'Interior and exterior painting' },
                { name: 'Electrician', icon: '⚡', category: 'Electrician', desc: 'Electrical installations and repairs' }
              ].map((service) => (
                <Link key={service.category} to={`/services?category=${service.category}`} className="block">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.desc}</p>
                    <div className="mt-4 text-green-600 font-medium">
                      Find professionals →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-600">Services Completed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-600 mb-2">1,200+</div>
                <div className="text-gray-600">Verified Professionals</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-green-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join Bahrain's trusted service network today.
            </p>
            <Link to="/sign-up">
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition">
                Join PearlConnect Bahrain
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img alt="PearlConnect Logo" className="h-6 w-6 mr-2" src="/img/logo.png" />
                <span className="text-lg font-bold">PearlConnect</span>
              </div>
              <p className="text-gray-400">
                Connecting communities in Bahrain, one service at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/services" className="hover:text-white">Find Services</Link></li>
                <li><Link to="/categories" className="hover:text-white">Browse Categories</Link></li>
                <li><Link to="/sign-up" className="hover:text-white">Become a Pro</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 PearlConnect Bahrain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
