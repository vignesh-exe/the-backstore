"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        />

        <circle cx="12" cy="12" r="2.8" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 3 18 18" />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3.2 3.8"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.7 6.8C4.1 8.4 2.5 12 2.5 12s3.5 6 9.5 6c1.3 0 2.5-.3 3.6-.8"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.9 9.9a3 3 0 0 0 4.2 4.2"
      />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    /*
     * Static frontend authentication.
     *
     * Replace these values above when you decide
     * your final admin username/password.
     */

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem("the-backstore-admin-auth", "authenticated");

      router.push("/admin/dashboard");

      return;
    }

    setLoading(false);

    setError("Invalid username or password.");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7fb] px-5 py-10">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#ff2d32]/5 blur-3xl" />

        <div className="absolute bottom-[-140px] right-[-100px] h-[350px] w-[350px] rounded-full bg-[#ff2d32]/5 blur-3xl" />
      </div>

      {/* =========================================================
          LOGIN CARD
      ========================================================= */}

      <div className="relative z-10 w-full max-w-[390px]">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-7 shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:p-9">
          {/* =====================================================
              LOGO
          ===================================================== */}

          <div className="flex justify-center">
            <div className="relative flex h-[82px] w-[210px] items-center justify-center">
              {/* Red comic paper */}

              <div
                className="absolute inset-x-3 inset-y-2 bg-[#ff2d32]"
                style={{
                  clipPath:
                    "polygon(3% 8%, 18% 4%, 34% 7%, 51% 3%, 67% 7%, 84% 4%, 98% 8%, 94% 91%, 77% 87%, 60% 95%, 42% 90%, 25% 95%, 7% 90%)",
                }}
              />

              <img
                src="/logo/backstore-logo.png"
                alt="The Backstore"
                className="relative z-10 h-[78px] w-auto max-w-[190px] object-contain"
              />
            </div>
          </div>

          {/* =====================================================
              TITLE
          ===================================================== */}

          <div className="mt-3 text-center">
            <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#172033]">
              Admin Login
            </h1>

            <p className="mt-1 text-[12px] text-[#718096]">
              Sign in to manage The Backstore.
            </p>
          </div>

          {/* =====================================================
              FORM
          ===================================================== */}

          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            {/* Username */}

            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-[12px] font-semibold text-[#334155]"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                className="h-[48px] w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 text-[14px] text-[#172033] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/5"
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[12px] font-semibold text-[#334155]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="h-[48px] w-full rounded-lg border border-[#cbd5e1] bg-white px-3.5 pr-12 text-[14px] text-[#172033] outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#172033] focus:ring-2 focus:ring-[#172033]/5"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-[#64748b] transition-colors hover:text-[#172033]"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] font-medium text-red-600">
                {error}
              </div>
            )}

            {/* Login */}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-[48px] w-full items-center justify-center rounded-lg bg-[#080808] text-[13px] font-bold text-white transition-all hover:bg-[#ff2d32] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          {/* =====================================================
              SMALL BRAND LINE
          ===================================================== */}

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-[#e2e8f0]" />

            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#94a3b8]">
              The Backstore
            </span>

            <span className="h-px w-8 bg-[#e2e8f0]" />
          </div>
        </div>
      </div>
    </main>
  );
}
