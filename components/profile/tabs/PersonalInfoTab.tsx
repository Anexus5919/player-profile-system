import React, { useState, useEffect } from "react";
import { Image as ImageIcon, ChevronDown, FileText, Trash2, Eye, Info, AlertCircle, ArrowRight, Check } from "lucide-react";
import { FormData, Units, IdentityFile } from "../CreateProfile";

// --- CONSTANTS ---
const COUNTRIES = [
    { name: "India", nationality: "Indian", code: "+91", flag: "🇮🇳", minLen: 10, maxLen: 10, placeholder: "9876543210" },
    { name: "USA", nationality: "American", code: "+1", flag: "🇺🇸", minLen: 10, maxLen: 10, placeholder: "2025550123" },
    { name: "UK", nationality: "British", code: "+44", flag: "🇬🇧", minLen: 10, maxLen: 11, placeholder: "7911123456" },
    { name: "Australia", nationality: "Australian", code: "+61", flag: "🇦🇺", minLen: 9, maxLen: 9, placeholder: "412345678" },
    { name: "Canada", nationality: "Canadian", code: "+1", flag: "🇨🇦", minLen: 10, maxLen: 10, placeholder: "4165550199" },
    { name: "Germany", nationality: "German", code: "+49", flag: "🇩🇪", minLen: 10, maxLen: 11, placeholder: "15223456789" },
    { name: "France", nationality: "French", code: "+33", flag: "🇫🇷", minLen: 9, maxLen: 9, placeholder: "612345678" },
    { name: "Japan", nationality: "Japanese", code: "+81", flag: "🇯🇵", minLen: 10, maxLen: 10, placeholder: "9012345678" },
    { name: "China", nationality: "Chinese", code: "+86", flag: "🇨🇳", minLen: 11, maxLen: 11, placeholder: "13800138000" },
    { name: "Brazil", nationality: "Brazilian", code: "+55", flag: "🇧🇷", minLen: 10, maxLen: 11, placeholder: "11912345678" },
    { name: "South Africa", nationality: "South African", code: "+27", flag: "🇿🇦", minLen: 9, maxLen: 9, placeholder: "721234567" },
];

const AVAILABLE_SPORTS = ["Badminton", "Cricket", "Football", "Tennis", "Squash"];

// --- STYLES ---
const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";

// --- COMPONENTS ---
const Label = ({ children, required = false }: { children: React.ReactNode, required?: boolean }) => (
    <label className={labelStyle}>
        {children} {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
);

const InfoTooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block ml-2 align-middle">
      <button type="button" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="text-gray-500 hover:text-lime-500 transition-colors focus:outline-none translate-y-[-1px]">
        <Info size={14} />
      </button>
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-gray-200 text-xs p-2 rounded border border-gray-700 shadow-xl z-20 text-center pointer-events-none animate-in fade-in zoom-in duration-200">
          {text} <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

interface Props {
  formData: FormData; handleChange: (e: any) => void; handleUnitChange: (t: any, v: any) => void;
  handleNationalityChange: (nat: string, code: string) => void;
  handleArrayChange: (field: keyof FormData, arr: string[]) => void;
  units: Units; bmi: any; profilePic: string | null; identityFile: IdentityFile | null;
  onPhotoUpload: (e: any) => void; onPhotoRemove: () => void; onIdentityUpload: (e: any) => void; onIdentityPreview: () => void; onPreview: () => void;
  onNext: () => void; 
}

const PersonalInfoTab: React.FC<Props> = ({ 
  formData, handleChange, handleUnitChange, handleNationalityChange, handleArrayChange, units, bmi, profilePic, identityFile, 
  onPhotoUpload, onPhotoRemove, onIdentityUpload, onIdentityPreview, onPreview, onNext
}) => {
  
  const currentCountry = COUNTRIES.find(c => c.nationality === formData.nationality) || COUNTRIES[0];
  const [hoverButton, setHoverButton] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // --- VALIDATION LOGIC ---
  useEffect(() => {
    const newErrors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.push("Full Name is required");
    if (!formData.dob) newErrors.push("Date of Birth is required");
    else if (new Date(formData.dob) > new Date()) newErrors.push("Date of Birth cannot be in the future");
    
    // Dynamic Phone Validation
    if (!formData.contactNo) {
        newErrors.push("Contact Number is required");
    } else {
        const len = formData.contactNo.length;
        if (len < currentCountry.minLen || len > currentCountry.maxLen) {
            newErrors.push(`Phone number for ${currentCountry.name} must be ${currentCountry.minLen === currentCountry.maxLen ? currentCountry.minLen : `${currentCountry.minLen}-${currentCountry.maxLen}`} digits.`);
        }
    }

    if (!formData.gender) newErrors.push("Gender is required");
    if (!formData.email) newErrors.push("Email is required");
    else if (!emailRegex.test(formData.email)) newErrors.push("Invalid Email Address");

    // NEW: Multi-Select Sports Validation
    if (formData.sports.length === 0) newErrors.push("Select at least one Sport");

    if (!formData.address.trim()) newErrors.push("Address is required");
    if (!identityFile) newErrors.push("Identity Proof is required");
    
    if (!formData.height || parseFloat(formData.height) <= 0) newErrors.push("Valid Height is required");
    if (!formData.weight || parseFloat(formData.weight) <= 0) newErrors.push("Valid Weight is required");
    if (!formData.dominantHand) newErrors.push("Dominant Hand is required");

    setErrors(newErrors);
  }, [formData, identityFile, currentCountry]);

  const isValid = errors.length === 0;

  // Toggle Sport Logic
  const toggleSport = (sport: string) => {
      const current = formData.sports;
      const updated = current.includes(sport) ? current.filter(s => s !== sport) : [...current, sport];
      handleArrayChange("sports", updated);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
      {/* Left Column (Photo) */}
      <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
        <div className={`w-full aspect-square bg-[#2C2C2C] rounded-lg border-2 border-dashed ${profilePic ? 'border-lime-500/50' : 'border-gray-600'} flex items-center justify-center overflow-hidden relative transition-colors`}>
          {profilePic ? <img src={profilePic} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center text-gray-500"><ImageIcon size={40} /></div>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer bg-[#2C2C2C] hover:bg-[#383838] text-gray-300 text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 border border-gray-700 hover:border-lime-500/50 transition-all">
            <ImageIcon size={16} className="text-lime-500" />
            <span>{profilePic ? "Change Photo" : "Select Photo"}</span>
            <input type="file" className="hidden" accept="image/*" onChange={onPhotoUpload} />
          </label>
          <span className="text-[10px] text-gray-500 text-center">(Supported: jpg, png, jpeg)</span>
          {profilePic && (
            <button type="button" onClick={onPhotoRemove} className="bg-red-900/20 hover:bg-red-900/40 text-red-500 text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 border border-red-900/50 transition-all">
              <Trash2 size={16} /> <span>Remove Photo</span>
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Fields */}
      <div className="flex-1 space-y-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4 uppercase">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Inputs */}
            <div><Label required>Full Name</Label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputBaseStyle} placeholder="Enter your full name" /></div>
            <div><Label required>Date of Birth</Label><input type="date" name="dob" value={formData.dob} onChange={handleChange} max={new Date().toISOString().split("T")[0]} className={`${inputBaseStyle} [color-scheme:dark]`} /></div>
            <div>
                <Label required>Contact No.</Label>
                <div className="flex"><div className="bg-[#1e1e1e] border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center text-gray-400 text-sm min-w-[80px] justify-center gap-2 select-none"><span>{currentCountry.flag}</span><span>{currentCountry.code}</span></div><input type="tel" name="contactNo" value={formData.contactNo} onChange={handleChange} className={`${inputBaseStyle} rounded-l-none`} placeholder={currentCountry.placeholder} maxLength={currentCountry.maxLen} /></div>
                <p className="text-[10px] text-gray-600 mt-1 ml-1">Required format: {currentCountry.minLen} digits for {currentCountry.name}</p>
            </div>
            <div><Label required>Gender</Label><div className="relative"><select name="gender" value={formData.gender} onChange={handleChange} className={`${inputBaseStyle} appearance-none`}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select><ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} /></div></div>
            <div><Label required>Email</Label><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputBaseStyle} placeholder="you@example.com" /></div>
            <div><Label required>Nationality</Label><div className="relative"><select name="nationality" value={formData.nationality} onChange={(e) => {const c = COUNTRIES.find(x => x.nationality === e.target.value); if(c) handleNationalityChange(c.nationality, c.code);}} className={`${inputBaseStyle} appearance-none`}><option value="">Select</option>{COUNTRIES.map(c => <option key={c.name} value={c.nationality}>{c.nationality} ({c.name})</option>)}</select><ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} /></div></div>
            <div className="md:col-span-1"><Label required>Address</Label><textarea name="address" rows={1} value={formData.address} onChange={handleChange} className={`${inputBaseStyle} resize-none overflow-hidden h-[42px]`} /></div>

            {/* --- MULTI SELECT SPORTS (Replaces Single Dropdown) --- */}
            <div>
              <Label required>Sports <InfoTooltip text="Select all sports you play" /></Label>
              <div className="bg-[#1a1a1a] p-3 rounded-md border border-gray-700 flex flex-wrap gap-2 min-h-[46px]">
                  {AVAILABLE_SPORTS.map(s => {
                      const isSelected = formData.sports.includes(s);
                      return (
                          <button 
                            key={s} type="button" onClick={() => toggleSport(s)}
                            className={`text-xs font-medium px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${isSelected ? "bg-lime-500/20 border-lime-500 text-lime-500" : "bg-[#2C2C2C] border-gray-600 text-gray-400 hover:text-gray-200"}`}
                          >
                              {isSelected && <Check size={10} />} {s}
                          </button>
                      )
                  })}
              </div>
            </div>

            {/* Identity Proof (RESTRICTED FILE TYPES) */}
            <div className="md:col-span-2">
               <Label required>
                  Identity Proof <InfoTooltip text="Valid ID: Aadhar, Passport, License" />
               </Label>
               <div className="flex gap-2">
                  <label className={`flex-1 cursor-pointer bg-[#2C2C2C] border rounded-md p-3 flex items-center gap-3 hover:border-lime-500/50 transition-colors ${!identityFile ? 'border-gray-700' : 'border-lime-500/50'}`}>
                     <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-lime-500"><FileText size={16} /></div>
                     <div className="flex flex-col"><span className="text-xs font-medium text-gray-300">{identityFile ? identityFile.name : "Browse"}</span><span className="text-[10px] text-gray-500">(png, jpg, jpeg, pdf)</span></div>
                     {/* RESTRICTED ACCEPT ATTRIBUTE */}
                     <input type="file" className="hidden" accept=".png, .jpg, .jpeg, .pdf" onChange={onIdentityUpload} />
                  </label>
                  <button type="button" onClick={onIdentityPreview} className={`bg-[#2C2C2C] text-gray-400 px-4 rounded-md border border-gray-700 flex items-center gap-2 ${identityFile ? "hover:text-white" : "opacity-50 cursor-not-allowed"}`}><Eye size={14}/> Preview</button>
               </div>
            </div>
          </div>
        </div>

        {/* Physical Attributes (Standard) */}
        <div>
          <h3 className="text-white font-bold text-lg mb-4 uppercase mt-6">Physical Attributes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div><Label required>Height</Label><div className="flex gap-2"><input type="number" name="height" value={formData.height} onChange={handleChange} className={inputBaseStyle} /><select value={units.height} onChange={(e) => handleUnitChange('height', e.target.value)} className="bg-[#2C2C2C] text-gray-400 text-xs rounded outline-none"><option value="cm">cm</option><option value="ft">ft</option></select></div></div>
             <div><Label required>Weight</Label><div className="flex gap-2"><input type="number" name="weight" value={formData.weight} onChange={handleChange} className={inputBaseStyle} /><select value={units.weight} onChange={(e) => handleUnitChange('weight', e.target.value)} className="bg-[#2C2C2C] text-gray-400 text-xs rounded outline-none"><option value="kg">kg</option><option value="lbs">lbs</option></select></div></div>
             <div><Label>BMI <InfoTooltip text="Calculated Body Mass Index" /></Label><div className="w-full bg-[#1e1e1e] rounded-md px-3 py-2.5 border border-gray-800 flex justify-between"><span className="text-gray-200 text-sm font-mono">{bmi.value || "--"}</span><span className={`text-xs font-bold uppercase ${bmi.color}`}>{bmi.status}</span></div></div>
             <div><Label required>Dominant Hand <InfoTooltip text="Hand used for sports" /></Label><div className="relative"><select name="dominantHand" value={formData.dominantHand} onChange={handleChange} className={`${inputBaseStyle} appearance-none`}><option value="">Select</option><option value="Right">Right</option><option value="Left">Left</option></select><ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} /></div></div>
             <div><Label>Physical Disability (if any) <InfoTooltip text="Any permanent physical impairment" /></Label><div className="relative"><select name="disability" value={formData.disability} onChange={handleChange} className={`${inputBaseStyle} appearance-none`}><option value="No">No</option><option value="Yes">Yes</option></select><ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} /></div></div>
             <div className="md:row-span-2"><Label>Description (if yes)</Label><textarea name="disabilityDesc" value={formData.disabilityDesc} onChange={handleChange} disabled={formData.disability !== 'Yes'} className={`${inputBaseStyle} h-[116px] resize-none ${formData.disability !== 'Yes' ? 'opacity-50' : ''}`} /></div>
             <div><Label>Wingspan <InfoTooltip text="Fingertip to fingertip length" /></Label><input type="text" name="wingspan" value={formData.wingspan} onChange={handleChange} className={inputBaseStyle} /></div>
             <div><Label>Agility Rating <InfoTooltip text="1-5 Scale of speed/coordination" /></Label><div className="relative"><select name="agilityRating" value={formData.agilityRating} onChange={handleChange} className={`${inputBaseStyle} appearance-none`}><option value="">Select</option>{[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}</select><ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} /></div></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800">
           <button type="button" onClick={onPreview} className="px-8 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide">Preview</button>
           
           {/* BUTTON CONTAINER FOR TOOLTIP */}
           <div 
             className="relative"
             onMouseEnter={() => setHoverButton(true)}
             onMouseLeave={() => setHoverButton(false)}
           >
               <button 
                    type="button" 
                    onClick={onNext}
                    disabled={!isValid}
                    className={`px-10 py-2.5 rounded-md font-bold uppercase tracking-wide flex items-center gap-2 transition-all
                        ${!isValid 
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" 
                            : "bg-gradient-to-r from-lime-600 to-lime-500 text-black hover:brightness-110"}`
                    }
                >
                    Next <ArrowRight size={18} />
                </button>

                {/* ERROR TOOLTIP */}
                {!isValid && hoverButton && (
                    <div className="absolute bottom-full right-0 mb-3 w-64 bg-red-900/90 text-white text-xs p-3 rounded-md border border-red-500 shadow-xl backdrop-blur-sm z-50 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-2 mb-2 border-b border-red-500/30 pb-2">
                            <AlertCircle size={14} className="text-red-400" />
                            <span className="font-bold text-red-200">Please fix the following:</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-1 text-red-100/80">
                            {errors.slice(0, 5).map((err, i) => (
                                <li key={i}>{err}</li>
                            ))}
                            {errors.length > 5 && <li>...and {errors.length - 5} more</li>}
                        </ul>
                        <div className="absolute top-full right-8 border-8 border-transparent border-t-red-900/90"></div>
                    </div>
                )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;