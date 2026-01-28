'use client';

import Link from 'next/link';
import { Ticket } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-500 p-1.5 rounded-lg">
                <Ticket className="text-white w-5 h-5 transform -rotate-45" />
              </div>
              <span className="text-lg font-bold">
                Tick<span className="text-orange-600">Flo</span>
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Streamline your ticket management and improve customer support efficiency.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Tickets
                </Link>
              </li>
              <li>
                <Link href="/tickets/create" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Create Ticket
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} TickFlo Inc. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
