import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const ForgotPassPage = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword } = useAuthStore();

  const handleSendEmail = () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    
    forgotPassword({ email });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">
          Forgot Password
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Enter your email address to receive a password reset link.
        </p>
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Send Email Button */}
          <button
            onClick={handleSendEmail}
            className="w-full py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;