import { useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, ArrowRight } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      await apiClient.post(API_ENDPOINTS.requestPasswordReset(), {
        email,
      });

      toast.success("Password reset link sent. Please check your email 📧");

      // Optional delay before redirect
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-[420px] bg-white rounded-xl shadow-md p-8">
        {/* ICON */}
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <Mail className="text-blue-600" />
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-semibold text-center mb-1">
          Forgot password?
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email address and we’ll send you a link to reset your
          password.
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email address</label>
          <input
            type="email"
            placeholder="name@company.com"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-11 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            "Sending..."
          ) : (
            <>
              Send Reset Link <ArrowRight size={16} />
            </>
          )}
        </button>

        {/* BACK TO LOGIN */}
        <div className="text-center mt-6">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            ← Back to Login
          </a>
        </div>
      </div>
    </AuthLayout>
  );
}
