"use client"

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';
import { z } from 'zod';
import Link from 'next/link';

type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "qa"
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
    <div className="min-h-screen bg-[#2C3E50] flex flex-col">
      {/* Header */}
      <header className="px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#F97316] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-white text-xl font-bold">
            Tick<span className="text-[#F97316]">Flo</span>
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center pt-12 px-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8">
          {/* Title */}
          <h1 className="text-[#F97316] text-3xl font-bold text-center mb-8">Register</h1>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                {...register("name")}
                className="w-full px-4 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-black text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full px-4 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-black text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register("password")}
                  className="w-full px-4 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className="w-full px-4 py-2.5 rounded border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-black text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-3 rounded transition-all disabled:opacity-50 mt-6"
            >
              {isSubmitting ? "Creating Account..." : "Register"}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[#F97316] font-bold hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#F97316] rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-white text-lg font-bold">
            Tick<span className="text-[#F97316]">Flo</span>
          </span>
        </div>
        <div className="text-gray-400 text-sm">
          <span>© 2026 TickFlo</span>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
