import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const ProfileFooter = () => (
  <footer className="bg-black border-t border-gray-800 py-12 px-4 text-sm mt-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
       <div className="flex flex-col gap-2">
         <div className="flex items-center"><img src="/logo.svg" alt="ZEMO Logo" className="h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div>
         <p className="text-[10px] text-lime-500 tracking-widest">SPORTIFY LIFE!</p>
       </div>
       <div><h4 className="text-lime-500 font-bold mb-4 uppercase text-xs tracking-wider">Useful Links</h4><ul className="space-y-3 text-gray-400"><li>Terms & Conditions</li><li>Privacy Policy</li><li>Refund Policy</li><li>Contact Us</li></ul></div>
       <div><h4 className="text-lime-500 font-bold mb-4 uppercase text-xs tracking-wider">Tournaments</h4><ul className="space-y-3 text-gray-400"><li>Upcoming</li><li>Ongoing</li><li>Concluded</li></ul></div>
       <div><h4 className="text-lime-500 font-bold mb-4 uppercase text-xs tracking-wider">Contact</h4><ul className="space-y-4 text-gray-400"><li className="flex gap-3 text-xs leading-relaxed"><MapPin size={16} className="text-lime-500 flex-shrink-0" />CIBA Voshi, 6th Floor, Agnel Technical Complex, Sector 9A Vashi, Navi Mumbai, Maharashtra 400703</li><li className="flex gap-3 items-center"><Mail size={16} className="text-lime-500" />support@zemo.co.in</li><li className="flex gap-3 items-center"><Phone size={16} className="text-lime-500" />+919082705182</li></ul></div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-gray-900 mt-12 pt-8 text-center text-gray-600 text-xs">&copy; 2025 Futurasport Catalyst Private Limited</div>
  </footer>
);
export default ProfileFooter;