import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, LogIn } from "lucide-react";
import AuthLayout from "../components/layout/AuthLayout";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);

      toast.success("Welcome back 👋");

      // ✅ Redirect after login
      navigate("/kpi");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-[420px] bg-white rounded-xl shadow-md p-8">
        {/* ICON */}
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
          <LogIn className="text-blue-600" />
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-semibold text-center mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Log in to your account to access Ops360.
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-md border px-3 py-2 text-sm pr-10 outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* FORGOT */}
        <div className="text-right mb-4">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-11 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {/* FOOT NOTE */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
