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
                    to="/public/login"
                    className="text-white/80 hover:text-white transition-colors duration-300 font-medium"
                  >
                    Public Login
                  </Link>
                  <Link
                    to="/auth/login"
                    className="bg-white text-blue-600 px-6 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg"
                  >
                    Staff Login
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

            {/* User Type Selection - CRITICAL ADDITION */}
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Get Started As:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Public User */}
                <Link 
                  to="/public/login"
                  className="group bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Public User</h4>
                    <p className="text-white/70 text-sm mb-4">Report problems, track issues</p>
                    <button className="text-blue-300 font-semibold text-sm group-hover:text-blue-200">
                      Login / Register →
                    </button>
                  </div>
                </Link>

                {/* Staff */}
                <Link 
                  to="/auth/login"
                  className="group bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">👨‍💼</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Staff / Admin</h4>
                    <p className="text-white/70 text-sm mb-4">Manage reports, assign tasks</p>
                    <button className="text-green-300 font-semibold text-sm group-hover:text-green-200">
                      Staff Login →
                    </button>
                  </div>
                </Link>

                {/* Collector */}
                <Link 
                  to="/collector/login"
                  className="group bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🚚</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Data Collector</h4>
                    <p className="text-white/70 text-sm mb-4">Collect field data, update status</p>
                    <button className="text-yellow-300 font-semibold text-sm group-hover:text-yellow-200">
                      Collector Login →
                    </button>
                  </div>
                </Link>

                {/* Department Head */}
                <Link 
                  to="/department-head/login"
                  className="group bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">👑</span>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Department Head</h4>
                    <p className="text-white/70 text-sm mb-4">Oversee departments, analytics</p>
                    <button className="text-purple-300 font-semibold text-sm group-hover:text-purple-200">
                      Dept. Head Login →
                    </button>
                  </div>
                </Link>
              </div>
              
              {/* Quick Guest Option */}
              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-white/80 mb-4">Want to report a problem without account?</p>
                <Link 
                  to="/public/report-problem"
                  className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all duration-300"
                >
                  <span>Report Problem as Guest</span>
                  <span className="text-lg">🚀</span>
                </Link>
              </div>
            </div>

            {/* CTA Buttons - UPDATED */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link
                to="/public/register"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Create Public Account</span>
                <span className="group-hover:translate-x-1 transition-transform">📝</span>
              </Link>
              
              <Link
                to="/public/report-problem"
                className="group border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Report Problem Now</span>
                <span className="group-hover:scale-110 transition-transform">🚨</span>
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

        {/* Features Grid - UPDATED */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🚨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">For Public Users</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Instant problem reporting</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Real-time tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Email/SMS notifications</span>
                </li>
              </ul>
              <Link to="/public/login" className="inline-block mt-4 text-blue-300 hover:text-blue-200 font-medium">
                Start Reporting →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">For Staff & Admin</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>AI-powered analytics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Task assignment system</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Performance monitoring</span>
                </li>
              </ul>
              <Link to="/auth/login" className="inline-block mt-4 text-blue-300 hover:text-blue-200 font-medium">
                Staff Login →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">For Collectors & Dept Heads</h3>
              <ul className="space-y-2 text-white/70">
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Field data collection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Department management</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-400">✓</span>
                  <span>Resource allocation</span>
                </li>
              </ul>
              <Link to="/collector/login" className="inline-block mt-4 text-blue-300 hover:text-blue-200 font-medium">
                Collector Login →
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works - UPDATED */}
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
              { step: "01", title: "Report Issue", desc: "Public users submit problem details", icon: "📝", link: "/public/report-problem" },
              { step: "02", title: "Auto Assignment", desc: "System assigns to relevant department", icon: "🤖", link: "/auth/login" },
              { step: "03", title: "Track Progress", desc: "Real-time updates on resolution status", icon: "📱", link: "/public/login" },
              { step: "04", title: "Problem Solved", desc: "Get notified when issue is resolved", icon: "✅", link: "/public/login" }
            ].map((item, index) => (
              <Link key={index} to={item.link} className="text-center group">
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
              </Link>
            ))}
          </div>
        </div>

        {/* Final CTA - UPDATED */}
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Role</span>
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Select your role to access the appropriate login page
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Link 
              to="/public/login" 
              className="bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <div className="font-bold text-white">Public User</div>
            </Link>
            <Link 
              to="/auth/login" 
              className="bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">👨‍💼</div>
              <div className="font-bold text-white">Staff/Admin</div>
            </Link>
            <Link 
              to="/collector/login" 
              className="bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">🚚</div>
              <div className="font-bold text-white">Collector</div>
            </Link>
            <Link 
              to="/department-head/login" 
              className="bg-white/5 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">👑</div>
              <div className="font-bold text-white">Dept. Head</div>
            </Link>
          </div>
          
          <Link
            to="/public/report-problem"
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            ⚡ Report a Problem as Guest (No Login Required)
          </Link>
        </div>

        {/* Footer - UPDATED */}
        <footer className="border-t border-white/20 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <span className="text-white font-bold">ADMINSIGHT</span>
                </div>
                <p className="text-white/70 text-sm">
                  Smart governance platform for efficient public service delivery.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <Link to="/public/login" className="block text-white/70 hover:text-white transition-colors text-sm">Public Login</Link>
                  <Link to="/auth/login" className="block text-white/70 hover:text-white transition-colors text-sm">Staff Login</Link>
                  <Link to="/public/report-problem" className="block text-white/70 hover:text-white transition-colors text-sm">Report Problem</Link>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-4">Need Help?</h4>
                <div className="space-y-2">
                  <Link to="/contact" className="block text-white/70 hover:text-white transition-colors text-sm">Contact Support</Link>
                  <Link to="/faq" className="block text-white/70 hover:text-white transition-colors text-sm">FAQ</Link>
                  <Link to="/guide" className="block text-white/70 hover:text-white transition-colors text-sm">User Guide</Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-white/20 pt-8 text-center">
              <div className="text-white/70 text-sm">
                © 2024 ADMINSIGHT. All rights reserved. | 
                <Link to="/privacy" className="mx-2 hover:text-white transition-colors">Privacy</Link> | 
                <Link to="/terms" className="mx-2 hover:text-white transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModernHomePage;