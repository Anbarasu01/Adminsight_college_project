import { Link } from "react-router-dom";

const PublicLogin = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 px-6 py-12">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel - Branding */}
        <div className="md:w-1/2 bg-gradient-to-br from-purple-700 to-blue-600 text-white p-12 flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-md text-center md:text-left">ADMINSIGHT</h1>
          <p className="text-xl opacity-90 leading-relaxed text-center md:text-left">
            Welcome to our secure admin portal. Manage your systems with ease and efficiency using our powerful tools and intuitive interface.
          </p>
        </div>

        {/* Right Panel - Action Buttons */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center items-center">
          <div className="text-center mb-10 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to ADMINSIGHT</h2>
            <p className="text-gray-600 mb-8">Choose an option to continue</p>
            
            <div className="space-y-4 w-full max-w-xs">
              <Link
                to="/login"
                className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-purple-600 transform hover:-translate-y-1 transition duration-300 text-center"
              >
                Login
              </Link>
              
              <Link
                to="/register"
                className="block w-full bg-gradient-to-r from-green-500 to-cyan-500 text-white py-4 rounded-xl font-bold shadow-lg hover:from-cyan-500 hover:to-green-500 transform hover:-translate-y-1 transition duration-300 text-center"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add Font Awesome CDN for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default PublicLogin;