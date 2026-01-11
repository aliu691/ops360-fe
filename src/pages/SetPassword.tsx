import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import { apiClient } from "../config/apiClient";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-hot-toast";
import AuthLayout from "../components/layout/AuthLayout";

export default function SetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = params.get("token");
  const type = params.get("type"); // "invite" | "reset"

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  // 🚨 Invalid link guard
  if (!token || !type) {
    return (
      <AuthLayout>
        <div className="text-gray-500 text-sm">Invalid or expired link</div>
      </AuthLayout>
    );
  }

  const submit = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      if (type === "invite") {
        await apiClient.post(API_ENDPOINTS.acceptInvite(), {
          token,
          password,
        });
      } else {
        await apiClient.post(API_ENDPOINTS.resetPassword(), {
          token,
          password,
        });
      }

      toast.success("Password set successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Unable to set password");
    } finally {
      setLoading(false);
    }
  };

  const isInvite = type === "invite";

  const copy = {
    title: isInvite ? "Set your password" : "Reset your password",
    subtitle: isInvite
      ? "Secure your account to access the Ops360 workspace."
      : "Create a new password to regain access to your account.",
    passwordLabel: isInvite ? "Create Password" : "New Password",
    button: isInvite ? "Set Password and Log In" : "Reset Password",
  };

  return (
    <AuthLayout>
      <div className="w-[420px] bg-white rounded-xl shadow-md p-8 space-y-6">
        {/* ICON */}
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Lock className="text-blue-600" />
          </div>
        </div>

        {/* TITLE */}
        <div className="text-center">
          <h1 className="text-xl font-semibold">{copy.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{copy.subtitle}</p>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm font-medium">{copy.passwordLabel}</label>
          <div className="relative mt-1">
            <input
              type={show ? "text" : "password"}
              className="w-full rounded-md border px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* CONFIRM */}
        <div>
          <label className="text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {/* REQUIREMENTS */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <p className="font-medium text-gray-600">Password requirements</p>
          <ul className="text-gray-500 space-y-1">
            <li>• At least 8 characters</li>
            <li>• One uppercase letter</li>
            <li>• One number</li>
            <li>• One special character</li>
          </ul>
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full h-11 rounded-md bg-blue-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Please wait..." : copy.button}
        </button>

        {/* FOOT NOTE */}
        <p className="text-sm text-center text-gray-500">
          Need help?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}
