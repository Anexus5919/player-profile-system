"use client";

import React, { useState } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const ProfileHeader = () => {
  const { logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* LOGO: h-12 to fit h-16 header */}
          <img src="/logo.svg" alt="ZEMO Logo" className="h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-lime-500 font-bold border border-lime-500 p-1">ZEMO</span>'; }} />
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-lime-500">
            {["Home", "ALL Players", "Sports", "Search", "Stats"].map((item) => (
               <a key={item} href="#" className="hover:text-white transition-colors flex items-center gap-1">{item} {item === "Sports" || item === "Search" ? <ChevronDown size={14}/> : null}</a>
            ))}
          </nav>

          {/* My Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-lime-500 hover:text-white transition-colors"
            >
              <User size={16} />
              My Profile
              <ChevronDown size={14} className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsProfileDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProfileHeader;