"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { 
  Search, Image as ImageIcon, ChevronDown, FileText, 
  Phone, Mail, MapPin, X, Trash2, Eye, ShieldCheck, Activity, Info
} from "lucide-react";

// --- Types ---
interface FormData {
  // Personal Info
  fullName: string;
  dob: string;
  sport: string;
  contactNo: string;
  gender: string;
  email: string;
  nationality: string;
  address: string;
  // Physical Attributes
  height: string;
  weight: string;
  dominantHand: string;
  disability: string;
  disabilityDesc: string;
  wingspan: string;
  agilityRating: string;
  // Sports Stats (Badminton specific based on image)
  statsSport: string;
  matchesPlayed: string;
  wins: string;
  loss: string;
  draws: string;
  aces: string;
  smashWinners: string;
}

interface Units {
  height: "cm" | "ft";
  weight: "kg" | "lbs";
}

interface IdentityFile {
  name: string;
  url: string;
  type: string;
}

// --- Player ID Card Preview Component ---
const PreviewModal = ({ 
  isOpen, 
  onClose, 
  data, 
  bmiData, 
  image,
  units
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: FormData; 
  bmiData: { value: string; status: string; color: string };
  image: string | null;
  units: Units;
}) => {
  if (!isOpen) return null;

  // Helper to calculate age
  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return isNaN(age) ? "N/A" : age;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-white/50 text-sm font-medium uppercase tracking-widest">Preview Mode</h3>
            <button onClick={onClose} className="text-white hover:text-lime-500 transition-colors">
                <X size={28} />
            </button>
        </div>

        {/* ID CARD UI */}
        <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative group max-h-[85vh] overflow-y-auto custom-scrollbar">
           {/* Decorative Top Border */}
           <div className="h-2 w-full bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 sticky top-0 z-20"></div>
           
           {/* Background Watermark */}
           <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] pointer-events-none rotate-12">
              <img src="/logo.svg" className="w-96 h-96" />
           </div>

           <div className="p-8 flex flex-col md:flex-row gap-8 relative z-10">
              
              {/* Left: Photo & Badge */}
              <div className="flex-shrink-0 flex flex-col items-center gap-4">
                 <div className="w-48 h-56 rounded-xl bg-gray-800 border-2 border-lime-500/30 overflow-hidden shadow-lg relative">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                            <ImageIcon size={32} />
                            <span className="text-xs uppercase font-bold">No Photo</span>
                        </div>
                    )}
                    {/* Sport Badge Overlay */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm py-2 text-center border-t border-lime-500/30">
                        <span className="text-lime-500 font-bold uppercase tracking-wider text-sm">
                            {data.sport || "ATHLETE"}
                        </span>
                    </div>
                 </div>
                 
                 {/* ID Number Fake */}
                 <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="flex gap-0.5">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className={`w-[2px] h-6 bg-white ${i%2===0 ? 'h-4' : 'h-6'}`}></div>
                        ))}
                    </div>
                    <span className="text-[10px] tracking-[0.2em] text-gray-400">ID: {Date.now().toString().slice(-8)}</span>
                 </div>
              </div>

              {/* Right: Stats & Details */}
              <div className="flex-1 w-full">
                 <div className="border-b border-gray-800 pb-4 mb-6">
                    <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        {data.fullName || "PLAYER NAME"}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-lime-500/10 text-lime-500 px-3 py-1 rounded text-xs font-bold uppercase border border-lime-500/20">
                            {data.nationality || "Unknown Nationality"}
                        </span>
                        <span className="text-gray-500 text-xs uppercase tracking-wider">
                           • {data.gender || "Gender N/A"} • {calculateAge(data.dob)} Years Old
                        </span>
                    </div>
                 </div>

                 {/* Physical Stats Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Height</span>
                        <span className="text-xl font-bold text-white">{data.height || "-"} <span className="text-xs text-gray-600">{units.height}</span></span>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800">
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Weight</span>
                        <span className="text-xl font-bold text-white">{data.weight || "-"} <span className="text-xs text-gray-600">{units.weight}</span></span>
                    </div>
                    <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 md:col-span-2 relative overflow-hidden">
                        <div className={`absolute right-0 top-0 h-full w-1 ${bmiData.color.replace('text-', 'bg-')}`}></div>
                        <span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">BMI Index</span>
                        <div className="flex items-baseline gap-2">
                           <span className={`text-xl font-bold ${bmiData.color}`}>{bmiData.value || "--"}</span>
                           <span className="text-xs text-gray-400">({bmiData.status})</span>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {/* Agility */}
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-gray-800">
                        <div className="flex items-center gap-3">
                            <Activity size={18} className="text-lime-500"/>
                            <span className="text-sm font-medium text-gray-300">Agility Rating</span>
                        </div>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                                <div 
                                    key={star} 
                                    className={`h-2 w-6 rounded-full transition-all ${star <= parseInt(data.agilityRating || '0') ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : 'bg-gray-700'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-400 mt-4 border-b border-gray-800 pb-4">
                         <div>
                            <span className="block text-gray-600 mb-0.5">Dominant Hand</span>
                            <span className="text-gray-200 font-medium">{data.dominantHand || "-"}</span>
                         </div>
                         <div>
                            <span className="block text-gray-600 mb-0.5">Wingspan</span>
                            <span className="text-gray-200 font-medium">{data.wingspan || "-"}</span>
                         </div>
                         <div className="col-span-2 flex flex-wrap gap-4">
                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-lime-500"/> {data.email || "No Email"}</span>
                            <span className="flex items-center gap-1.5"><Phone size={12} className="text-lime-500"/> {data.contactNo || "No Phone"}</span>
                         </div>
                    </div>

                    {/* Stats Preview Section */}
                    {data.matchesPlayed && (
                        <div className="pt-2">
                            <h4 className="text-lime-500 font-bold uppercase text-xs mb-2 tracking-wider">Season Stats ({data.statsSport || "Badminton"})</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="bg-[#1a1a1a] p-2 rounded border border-gray-800 text-center">
                                    <span className="block text-[10px] text-gray-500">Matches</span>
                                    <span className="text-white font-bold">{data.matchesPlayed}</span>
                                </div>
                                <div className="bg-[#1a1a1a] p-2 rounded border border-gray-800 text-center">
                                    <span className="block text-[10px] text-gray-500">Wins</span>
                                    <span className="text-lime-500 font-bold">{data.wins}</span>
                                </div>
                                <div className="bg-[#1a1a1a] p-2 rounded border border-gray-800 text-center">
                                    <span className="block text-[10px] text-gray-500">Aces</span>
                                    <span className="text-white font-bold">{data.aces}</span>
                                </div>
                            </div>
                        </div>
                    )}
                 </div>

              </div>
           </div>
        </div>
        
        {/* Helper text */}
        <p className="text-center text-gray-500 text-xs mt-4">
            * This card is a preview representation of your profile data.
        </p>

      </div>
    </div>
  );
};

// --- Identity Document Preview Modal ---
const IdentityModal = ({ 
    isOpen, 
    onClose, 
    file 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    file: IdentityFile | null; 
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] border border-gray-700 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#121212]">
            <h3 className="text-lime-500 font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck size={18}/> Identity Proof Preview
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          
          <div className="flex-1 bg-[#0a0a0a] p-4 flex items-center justify-center overflow-auto relative">
             {file ? (
                 file.type.startsWith("image/") ? (
                    <img src={file.url} alt="Identity Proof" className="max-w-full max-h-full object-contain" />
                 ) : file.type === "application/pdf" ? (
                    <iframe src={file.url} className="w-full h-full border-0" title="PDF Preview"></iframe>
                 ) : (
                    <div className="text-center text-gray-400">
                        <FileText size={48} className="mx-auto mb-2 opacity-50"/>
                        <p>Preview not available for this file type.</p>
                        <p className="text-xs mt-1">{file.name}</p>
                    </div>
                 )
             ) : (
                <p className="text-gray-500">No document selected</p>
             )}
          </div>
  
          <div className="p-4 border-t border-gray-700 bg-[#121212] flex justify-between items-center">
            <span className="text-xs text-gray-400 truncate max-w-[300px]">
                {file?.name}
            </span>
            <button onClick={onClose} className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600">Close</button>
          </div>
        </div>
      </div>
    );
  };

// --- Main Component ---
const CreateProfile = () => {
  // --- State ---
  const [formData, setFormData] = useState<FormData>({
    fullName: "", dob: "", sport: "", contactNo: "", gender: "",
    email: "", nationality: "", address: "", 
    height: "", weight: "",
    dominantHand: "", disability: "No", disabilityDesc: "", wingspan: "", agilityRating: "",
    // Stats default
    statsSport: "Badminton",
    matchesPlayed: "", wins: "", loss: "", draws: "", aces: "", smashWinners: ""
  });

  const [units, setUnits] = useState<Units>({ height: "cm", weight: "kg" });
  const [bmi, setBmi] = useState({ value: "", status: "", color: "text-gray-500" });
  
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [identityFile, setIdentityFile] = useState<IdentityFile | null>(null);
  
  const [activeTab, setActiveTab] = useState("PERSONAL INFO");
  const [showPreview, setShowPreview] = useState(false);
  const [showIdentityPreview, setShowIdentityPreview] = useState(false);
  
  // Replaced individual state with a unified activeTooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUnitChange = (type: "height" | "weight", value: string) => {
    setUnits(prev => ({ ...prev, [type]: value }));
  };

  // --- BMI Logic ---
  useEffect(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);

    if (h > 0 && w > 0) {
      let heightInMeters = units.height === "cm" ? h / 100 : h * 0.3048;
      let weightInKg = units.weight === "kg" ? w : w * 0.453592;

      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      
      let status = "Normal";
      let color = "text-lime-500";
      
      const bmiNum = parseFloat(bmiValue);
      // Updated BMI categories based on the image provided
      if (bmiNum < 18.5) { 
        status = "Underweight"; 
        color = "text-red-500"; 
      } else if (bmiNum >= 18.5 && bmiNum < 25) { 
        status = "Normal"; 
        color = "text-lime-500"; 
      } else if (bmiNum >= 25 && bmiNum < 30) { 
        status = "Overweight"; 
        color = "text-yellow-500"; 
      } else if (bmiNum >= 30) { 
        status = "Obesity"; 
        color = "text-red-500"; 
      }

      setBmi({ value: bmiValue, status, color });
    } else {
      setBmi({ value: "", status: "", color: "text-gray-500" });
    }
  }, [formData.height, formData.weight, units]);

  // --- Photo Handlers ---
  const handleProfilePicUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeProfilePic = () => {
    setProfilePic(null);
  };

  // --- Identity Handler ---
  const handleIdentityUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIdentityFile({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { formData, bmi, units });
    alert("Profile Submitted!");
  };

  // --- Styles ---
  const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
  const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";
  const sectionHeaderStyle = "text-white font-bold text-lg mb-4 uppercase";

  // --- Helper: Info Tooltip Component ---
  const InfoTooltip = ({ id, text }: { id: string, text: string }) => (
    <div className="relative inline-block ml-2 align-middle">
      <button 
          type="button" 
          onClick={() => setActiveTooltip(activeTooltip === id ? null : id)}
          onMouseEnter={() => setActiveTooltip(id)}
          onMouseLeave={() => setActiveTooltip(null)}
          className="text-gray-500 hover:text-lime-500 transition-colors focus:outline-none translate-y-[-1px]"
      >
          <Info size={14} />
      </button>
      
      {activeTooltip === id && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-gray-200 text-xs p-2 rounded border border-gray-700 shadow-xl z-20 text-center animate-in fade-in zoom-in duration-200 pointer-events-none">
              {text}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
      )}
   </div>
  );

  return (
    <div className="min-h-screen bg-black font-sans text-gray-300 flex flex-col">
      {/* Modals */}
      <PreviewModal 
         isOpen={showPreview} 
         onClose={() => setShowPreview(false)} 
         data={formData} 
         bmiData={bmi} 
         image={profilePic} 
         units={units}
      />
      <IdentityModal isOpen={showIdentityPreview} onClose={() => setShowIdentityPreview(false)} file={identityFile} />

      {/* --- Header --- */}
      <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo from Public Folder */}
            <img 
               src="/logo.svg" 
               alt="ZEMO Logo" 
               className="h-12 w-auto object-contain" 
               onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   e.currentTarget.parentElement!.innerHTML = '<span class="text-lime-500 font-bold border border-lime-500 p-1">ZEMO</span>';
               }}
            />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-lime-500">
            {["Home", "ALL Players", "Sports", "Search", "Stats"].map((item) => (
               <a key={item} href="#" className="hover:text-white transition-colors flex items-center gap-1">
                 {item} {item === "Sports" || item === "Search" ? <ChevronDown size={14}/> : null}
               </a>
            ))}
          </nav>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-lime-500 mb-2 uppercase">Create Your Profile</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">
            Enter personal details, physical stats, and sports information.
          </p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          
          <div className="flex flex-wrap border-b border-gray-700 bg-[#121212]">
            {["PERSONAL INFO", "SPORTS STATS", "BIO", "PARTICIPATION", "ACHIEVEMENTS", "MEDIA"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs md:text-sm font-bold tracking-wide transition-colors relative
                  ${activeTab === tab ? "text-lime-500" : "text-gray-500 hover:text-gray-300"}
                `}
              >
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lime-500" />}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10">
            
            {/* ==================================================================================== */}
            {/* VIEW: PERSONAL INFO */}
            {/* ==================================================================================== */}
            {activeTab === "PERSONAL INFO" && (
                <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
                
                {/* Left Column: Profile Picture */}
                <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
                    <div className="w-full aspect-square bg-[#2C2C2C] rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden relative group">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                        <div className="w-24 h-24 rounded-full border-4 border-gray-600 flex items-center justify-center mb-2">
                            <ImageIcon size={40} />
                        </div>
                        </div>
                    )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="cursor-pointer bg-[#2C2C2C] hover:bg-[#383838] text-gray-300 text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all border border-gray-700">
                            <ImageIcon size={16} className="text-lime-500" />
                            <span>{profilePic ? "Change Photo" : "Select Photo"}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicUpload} />
                        </label>
                        {/* Supported Files Text Added Here */}
                        <span className="text-[10px] text-gray-500 text-center">(Supported: jpg, png, jpeg)</span>
                        
                        {profilePic && (
                            <button 
                                type="button" 
                                onClick={removeProfilePic}
                                className="bg-red-900/20 hover:bg-red-900/40 text-red-500 text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all border border-red-900/50"
                            >
                                <Trash2 size={16} />
                                <span>Remove Photo</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: Fields */}
                <div className="flex-1 space-y-8">
                    
                    {/* Personal Info Section */}
                    <div>
                    <h3 className={sectionHeaderStyle}>Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        
                        <div>
                        <label className={labelStyle}>Full Name</label>
                        <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputBaseStyle} />
                        </div>

                        <div>
                        <label className={labelStyle}>Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={`${inputBaseStyle} [color-scheme:dark]`} />
                        </div>

                        <div>
                        <label className={labelStyle}>Contact No.</label>
                        <input type="tel" name="contactNo" value={formData.contactNo} onChange={handleInputChange} className={inputBaseStyle} />
                        </div>

                        <div>
                        <label className={labelStyle}>Gender</label>
                        <div className="relative">
                            <select name="gender" value={formData.gender} onChange={handleInputChange} className={`${inputBaseStyle} appearance-none`}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        </div>

                        <div>
                        <label className={labelStyle}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputBaseStyle} />
                        </div>

                        <div>
                        <label className={labelStyle}>Nationality</label>
                        <div className="relative">
                            <select name="nationality" value={formData.nationality} onChange={handleInputChange} className={`${inputBaseStyle} appearance-none`}>
                            <option value="">Select</option>
                            <option value="Indian">Indian</option>
                            <option value="American">American</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        </div>

                        <div className="md:col-span-1">
                        <label className={labelStyle}>Address</label>
                        <textarea name="address" rows={1} value={formData.address} onChange={handleInputChange} className={`${inputBaseStyle} resize-none overflow-hidden h-[42px]`} />
                        </div>

                        <div>
                        <label className={labelStyle}>Sport Name</label>
                        <div className="relative">
                            <select name="sport" value={formData.sport} onChange={handleInputChange} className={`${inputBaseStyle} appearance-none`}>
                            <option value="">Select</option>
                            <option value="Football">Football</option>
                            <option value="Cricket">Cricket</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        </div>

                        {/* Identity Proof (Updated with Tooltip) */}
                        <div className="md:col-span-2 mt-2">
                        <label className={labelStyle}>
                            Identity Proof
                            <InfoTooltip 
                                id="identity" 
                                text="Official document verifying your identity (e.g., Aadhar Card, Passport, Driving License)." 
                            />
                        </label>
                        <div className="flex gap-2 items-center">
                            <label className="flex-1 cursor-pointer bg-[#2C2C2C] border border-gray-700 rounded-md p-3 flex items-center gap-3 group hover:border-lime-500/50 transition-colors">
                                <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-lime-500 group-hover:bg-gray-600">
                                    <FileText size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-gray-300">
                                    {identityFile ? identityFile.name : "Browse"}
                                    </span>
                                    <span className="text-[10px] text-gray-500">(pdf, jpg, png)</span>
                                </div>
                                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleIdentityUpload} />
                            </label>
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (identityFile) {
                                        setShowIdentityPreview(true);
                                    } else {
                                        alert("Please upload a document first.");
                                    }
                                }} 
                                className={`bg-[#2C2C2C] text-gray-400 text-xs font-medium px-4 py-4 rounded-md border border-gray-700 transition-colors flex items-center gap-2
                                    ${identityFile ? "hover:text-white hover:border-lime-500/50" : "opacity-50 cursor-not-allowed"}
                                `}>
                                <Eye size={14}/> Preview
                            </button>
                        </div>
                        </div>

                    </div>
                    </div>

                    {/* Physical Attributes Section */}
                    <div>
                    <h3 className={`${sectionHeaderStyle} mt-6`}>Physical Attributes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div>
                        <label className={labelStyle}>Height</label>
                        <div className="flex gap-2">
                            <input 
                            type="number" name="height" value={formData.height} onChange={handleInputChange} 
                            className={inputBaseStyle} placeholder="0.0" 
                            />
                            <select value={units.height} onChange={(e) => handleUnitChange('height', e.target.value)} className="bg-[#2C2C2C] text-gray-400 text-xs rounded border border-transparent px-1 outline-none focus:text-lime-500">
                                <option value="cm">cm</option>
                                <option value="ft">ft</option>
                            </select>
                        </div>
                        </div>
                        
                        <div>
                        <label className={labelStyle}>Weight</label>
                        <div className="flex gap-2">
                            <input 
                                type="number" name="weight" value={formData.weight} onChange={handleInputChange} 
                                className={inputBaseStyle} placeholder="0.0" 
                            />
                            <select value={units.weight} onChange={(e) => handleUnitChange('weight', e.target.value)} className="bg-[#2C2C2C] text-gray-400 text-xs rounded border border-transparent px-1 outline-none focus:text-lime-500">
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                        </div>
                        </div>

                        <div>
                        {/* Added BMI Tooltip */}
                        <label className={labelStyle}>
                            BMI <InfoTooltip id="bmi" text="Body Mass Index calculated from height and weight to categorize body mass." />
                        </label>
                        <div className={`w-full bg-[#1e1e1e] rounded-md px-3 py-2.5 border border-gray-800 flex items-center justify-between`}>
                            <span className="text-gray-200 text-sm font-mono">{bmi.value || "--"}</span>
                            <span className={`text-xs font-bold uppercase ${bmi.color}`}>{bmi.status}</span>
                        </div>
                        </div>

                        <div>
                        {/* Added Dominant Hand Tooltip */}
                        <label className={labelStyle}>
                            Dominant Hand <InfoTooltip id="dominantHand" text="The hand you naturally use for detailed tasks (throwing, writing)." />
                        </label>
                        <div className="relative">
                            <select name="dominantHand" value={formData.dominantHand} onChange={handleInputChange} className={`${inputBaseStyle} appearance-none`}>
                                <option value="">Select</option>
                                <option value="Right">Right</option>
                                <option value="Left">Left</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        </div>

                        <div>
                        {/* Added Physical Disability Tooltip */}
                        <label className={labelStyle}>
                            Physical disability <InfoTooltip id="disability" text="Any permanent physical impairment that affects sports performance." />
                        </label>
                        <div className="relative">
                            <select name="disability" value={formData.disability} onChange={handleInputChange} className={`${inputBaseStyle} appearance-none`}>
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        </div>

                        <div className="md:row-span-2">
                            <label className={labelStyle}>If yes, description</label>
                            <textarea 
                            name="disabilityDesc" 
                            value={formData.disabilityDesc} 
                            onChange={handleInputChange} 
                            disabled={formData.disability !== 'Yes'}
                            className={`${inputBaseStyle} h-[116px] resize-none ${formData.disability !== 'Yes' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            />
                        </div>

                        {/* Wingspan with Tooltip (Updated to use new system) */}
                        <div>
                        <label className={labelStyle}>
                            Wingspan (optional) <InfoTooltip id="wingspan" text="The full length from fingertip to fingertip with arms outstretched." />
                        </label>
                        <input type="text" name="wingspan" value={formData.wingspan} onChange={handleInputChange} className={inputBaseStyle} />
                        </div>

                        <div>
                        {/* Added Agility Rating Tooltip */}
                        <label className={labelStyle}>
                            Agility rating <InfoTooltip id="agility" text="Self-assessed speed and coordination rating (1 = Low, 5 = Elite)." />
                        </label>
                        <div className="relative">
                            <select name="agilityRating" value={formData.agilityRating} onChange={handleInputChange} className={`${inputBaseStyle} appearance-none`}>
                                <option value="">Select</option>
                                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                        </div>

                    </div>
                    </div>

                </div>
                </div>
            )}

            {/* ==================================================================================== */}
            {/* VIEW: SPORTS STATS */}
            {/* ==================================================================================== */}
            {activeTab === "SPORTS STATS" && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex justify-end mb-6">
                        <div className="relative w-48">
                            <span className="absolute -top-5 left-0 text-[#a3a3a3] text-xs font-medium">Select Sport :</span>
                            <select 
                                name="statsSport"
                                value={formData.statsSport} 
                                onChange={handleInputChange} 
                                className="w-full bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md outline-none border border-gray-700 appearance-none focus:border-lime-500"
                            >
                                <option value="Badminton">Badminton</option>
                                <option value="Tennis">Tennis</option>
                                <option value="Squash">Squash</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { label: "Matches Played", name: "matchesPlayed" },
                            { label: "No. Of Wins", name: "wins" },
                            { label: "No. Of Loss", name: "loss" },
                            { label: "No. Of Draws/Tie/NR", name: "draws" },
                            { label: "Aces", name: "aces" },
                            { label: "Smash Winners", name: "smashWinners" },
                        ].map((item) => (
                            <div key={item.name} className="bg-[#0f0f0f] p-6 rounded-lg border border-gray-800 shadow-md">
                                <h4 className="text-[#d9f99d] text-lg font-medium mb-6">{item.label}</h4>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm font-medium">Matches</span>
                                    <input 
                                        type="text" 
                                        name={item.name}
                                        value={(formData as any)[item.name]} 
                                        onChange={handleInputChange}
                                        className="w-24 bg-[#2C2C2C] text-white rounded px-3 py-1.5 outline-none border border-transparent focus:border-lime-500/50 text-center"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800">
               <button 
                  type="button" 
                  onClick={() => setShowPreview(true)}
                  className="px-8 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide"
               >
                 Preview
               </button>
               <button type="submit" className="px-10 py-2.5 rounded-md bg-gradient-to-r from-lime-600 to-lime-500 text-black font-bold hover:brightness-110 transition-all uppercase tracking-wide shadow-[0_0_15px_rgba(132,204,22,0.4)]">
                 Submit
               </button>
            </div>

          </form>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-black border-t border-gray-800 py-12 px-4 text-sm mt-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
           <div className="flex flex-col gap-2">
             <div className="flex items-center">
                {/* Logo from Public Folder */}
                <img 
                   src="/logo.svg" 
                   alt="ZEMO Logo" 
                   className="h-12 w-auto object-contain" 
                   onError={(e) => {
                       e.currentTarget.style.display = 'none';
                   }} 
                />
             </div>
             <p className="text-[10px] text-lime-500 tracking-widest">SPORTIFY LIFE!</p>
           </div>
           <div>
              <h4 className="text-lime-500 font-bold mb-4 uppercase text-xs tracking-wider">Useful Links</h4>
              <ul className="space-y-3 text-gray-400">
                 <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                 <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                 <li><a href="#" className="hover:text-white">Refund Policy</a></li>
                 <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-lime-500 font-bold mb-4 uppercase text-xs tracking-wider">Tournaments</h4>
              <ul className="space-y-3 text-gray-400">
                 <li><a href="#" className="hover:text-white">Upcoming</a></li>
                 <li><a href="#" className="hover:text-white">Ongoing</a></li>
                 <li><a href="#" className="hover:text-white">Concluded</a></li>
              </ul>
           </div>
           <div>
              <h4 className="text-lime-500 font-bold mb-4 uppercase text-xs tracking-wider">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                 <li className="flex gap-3 text-xs leading-relaxed">
                    <MapPin size={16} className="text-lime-500 flex-shrink-0" />
                    CIBA Voshi, 6th Floor, Agnel Technical Complex, Sector 9A Vashi, Navi Mumbai, Maharashtra 400703
                 </li>
                 <li className="flex gap-3 items-center">
                    <Mail size={16} className="text-lime-500" />
                    support@zemo.co.in
                 </li>
                 <li className="flex gap-3 items-center">
                    <Phone size={16} className="text-lime-500" />
                    +919082705182
                 </li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-900 mt-12 pt-8 text-center text-gray-600 text-xs">
           &copy; 2025 Futurasport Catalyst Private Limited
        </div>
      </footer>
    </div>
  );
};

export default CreateProfile;