"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, Ticket } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormInputs } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  
  // Check if mock mode is enabled
  const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
    } catch (err: any) {
      // Error already handled by AuthContext and axios interceptor
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans">
      {/* Mock Mode Banner */}
      {isMockMode && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-semibold">
          🧪 MOCK MODE: Use admin@tickflo.com / admin123 (or developer/customer)
        </div>
      )}

      {/* Navigation / Header */}
      <header className="p-6 flex items-center">
        <div className="flex items-center gap-2">
          <div className="bg-[#F97316] p-1.5 rounded-lg">
            <Ticket className="text-white w-6 h-6 transform -rotate-45" />
          </div>
          <span className="text-white text-xl font-bold tracking-tight">
            Tick<span className="text-[#F97316]">Flow</span>
          </span>
        </div>
      </header>

      {/* Main Login Section */}
      <main className="grow flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 md:p-10">
          <div className="text-center mb-10">
            <h1 className="text-[#0F172A] text-3xl font-extrabold mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
          </div>

          {/* Mock Mode Credentials Helper */}
          {isMockMode && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Test Credentials:</p>
              <div className="text-xs text-blue-800 space-y-1">
                <p>👑 Admin: admin@tickflo.com / admin123</p>
                <p>💻 Developer: developer@tickflo.com / dev123</p>
                <p>👤 Customer: customer@tickflo.com / customer123</p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-black"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full px-4 text-black py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center mt-8 text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="/register" className="text-[#F97316] font-bold hover:underline">
              Create account
            </a>
          </p>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="p-6 text-center">
        <p className="text-slate-500 text-xs">
          © 2026 Tickflo Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
