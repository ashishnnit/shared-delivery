import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    await login(formData);
  };

  const handleAdminLogin = () => {
    navigate("/adminLogin"); // Navigate to the AdminLogin page
  };

  return (
    <div className=" fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 ">
      {/* Admin Login Button */}
      <div className="absolute top-20 right-4">
        <button
          onClick={handleAdminLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login as Admin
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105">
        {/* Logo and Heading */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center animate-bounce">
              <Mail className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold mt-2 text-gray-800">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-sky-100 text-black"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-sky-100 text-black"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Logging in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Link to Signup Page */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline hover:text-purple-600 transition-colors">
              Create account
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="text-purple-500 hover:underline hover:text-purple-600 transition-colors">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;