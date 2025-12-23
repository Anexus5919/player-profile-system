import React from "react";
import { ChevronDown } from "lucide-react";

const ProfileHeader = () => (
  <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center">
        {/* LOGO: h-12 to fit h-16 header */}
        <img src="/logo.svg" alt="ZEMO Logo" className="h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-lime-500 font-bold border border-lime-500 p-1">ZEMO</span>'; }} />
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-lime-500">
        {["Home", "ALL Players", "Sports", "Search", "Stats"].map((item) => (
           <a key={item} href="#" className="hover:text-white transition-colors flex items-center gap-1">{item} {item === "Sports" || item === "Search" ? <ChevronDown size={14}/> : null}</a>
        ))}
      </nav>
    </div>
  </header>
);
export default ProfileHeader;