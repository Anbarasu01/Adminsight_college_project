import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ModernHomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4000ms' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-white text-2xl font-bold">ADMINSIGHT</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to={
                    user.role === 'collector' ? '/collector/dashboard' :
                    user.role === 'departmentHead' ? '/department-head/dashboard' :
                    user.role === 'staff' ? '/staff/dashboard' : '/public/dashboard'
                  }
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 font-semibold"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="bg-white text-blue-600 px-6 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
              <span className="text-sm font-medium">Trusted by 500+ Government Departments</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              Smart
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Governance
              </span>
              Platform
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform public service delivery with our AI-powered platform. 
              Streamline problem reporting, resource management, and citizen engagement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link
                to="/public/report-problem"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Report a Problem</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <Link
                to="/auth/login"
                className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>View Demo</span>
                <span className="group-hover:scale-110 transition-transform">🎯</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70">Problems Resolved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-white/70">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
                <div className="text-white/70">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Instant Problem Reporting</h3>
              <p className="text-white/70 leading-relaxed">
                Report civic issues instantly with our streamlined form. Get real-time tracking and updates.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Dashboard</h3>
              <p className="text-white/70 leading-relaxed">
                AI-powered analytics and insights for efficient resource allocation and problem resolution.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Multi-Role Access</h3>
              <p className="text-white/70 leading-relaxed">
                Dedicated interfaces for citizens, staff, department heads, and data collectors.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It <span className="text-yellow-300">Works</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Simple steps to get your problems resolved quickly and efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Report Issue", desc: "Fill our simple form with problem details", icon: "📝" },
              { step: "02", title: "Auto Assignment", desc: "System assigns to relevant department", icon: "🤖" },
              { step: "03", title: "Track Progress", desc: "Real-time updates on resolution status", icon: "📱" },
              { step: "04", title: "Problem Solved", desc: "Get notified when issue is resolved", icon: "✅" }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border border-white/20">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by <span className="text-green-300">Thousands</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "City Mayor", quote: "Reduced response time by 70%", avatar: "👩‍💼" },
              { name: "Mike Rodriguez", role: "Public Works Director", quote: "Streamlined our entire workflow", avatar: "👨‍💼" },
              { name: "Emily Watson", role: "Community Manager", quote: "Citizen satisfaction skyrocketed", avatar: "👩‍🔧" }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-white/70 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-white/80 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Public Service</span>?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and government departments using ADMINSIGHT
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/public/report-problem"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Report a Problem Now
            </Link>
            <Link
              to="/auth/login"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Admin Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/20 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-white font-bold">ADMINSIGHT</span>
              </div>
              
              <div className="text-white/70 text-sm">
                © 2024 ADMINSIGHT. All rights reserved.
              </div>
              
              <div className="flex space-x-6">
                <Link to="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">Privacy</Link>
                <Link to="/terms" className="text-white/70 hover:text-white transition-colors text-sm">Terms</Link>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors text-sm">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModernHomePage;