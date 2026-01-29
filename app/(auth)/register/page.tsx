"use client"

import React, { useState } from 'react';
import { Eye, EyeOff, Ticket } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "customer"
    }
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await registerUser(data.name, data.email, data.password, data.role);
    } catch (err: any) {
      // Error already handled by AuthContext and axios interceptor
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="bg-[#F97316] p-1.5 rounded-lg">
            <Ticket className="text-white w-5 h-5 transform -rotate-45" />
          </div>
          <span className="text-white text-lg font-bold tracking-tight">
            Tick<span className="text-[#F97316]">Flo</span>
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-4 md:p-6 border border-slate-100 flex flex-col justify-center h-full">
          
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-[#0F172A] text-2xl font-extrabold mb-1">Create Account</h1>
            <p className="text-slate-500 text-xs">Join TickFlo to manage your tickets effortlessly.</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={`w-full px-3 py-2.5 rounded-xl border ${errors.name ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none placeholder:text-slate-400 text-black`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                {...register("email")}
                className={`w-full px-3 py-2.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none placeholder:text-slate-400 text-black`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Role</label>
              <select
                {...register("role")}
                className={`w-full px-3 py-2.5 rounded-xl border ${errors.role ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none bg-white text-black cursor-pointer appearance-none`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="customer">Customer</option>
                <option value="developer">Developer</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full px-3 py-2.5 rounded-xl border ${errors.password ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none placeholder:text-slate-400 text-black`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={`w-full px-3 py-2.5 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none placeholder:text-slate-400 text-black`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>

          </form>

          {/* Footer Link */}
          <p className="text-center mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <a href="/login" className="text-[#F97316] font-bold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-14 p-4 flex items-center justify-center">
        <p className="text-slate-500 text-xs">
          © 2026 Tickflo Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default RegisterPage;
