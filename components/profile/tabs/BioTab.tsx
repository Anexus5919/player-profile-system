import React, { useState, KeyboardEvent, useEffect } from "react";
import { ArrowRight, ArrowLeft, Facebook, Instagram, Twitter, Linkedin, Check, X, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FormData } from "../CreateProfile";

// --- CONSTANTS ---
const AVAILABLE_LANGUAGES = [
    "English", "Hindi", "Spanish", "French", "German", "Mandarin", "Arabic", "Russian", "Portuguese", "Bengali", "Marathi", "Telugu", "Tamil", "Urdu"
];
const BIO_CHARACTER_LIMIT = 500;

// --- STYLES ---
const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";
const sectionHeaderStyle = "text-white font-bold text-lg mb-6 uppercase";

interface Props {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSocialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleArrayChange: (fieldName: keyof FormData, newArray: string[]) => void;
  onPreview: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const BioTab: React.FC<Props> = ({ 
  formData, handleChange, handleSocialChange, handleArrayChange, onPreview, onNext, onPrevious 
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [hoverButton, setHoverButton] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState(true); // Default open to show required fields

  // --- VALIDATION LOGIC ---
  useEffect(() => {
      const newErrors = [];
      if (!formData.bio.trim()) newErrors.push("Bio is required.");
      if (formData.languages.length === 0) newErrors.push("Select at least one language.");
      
      // Mandatory Descriptions
      if (!formData.strengthDescription.trim()) newErrors.push("Strength Description is required.");
      if (!formData.weaknessDescription.trim()) newErrors.push("Weakness Description is required.");
      
      setErrors(newErrors);
  }, [formData.bio, formData.languages, formData.strengthDescription, formData.weaknessDescription]);

  const isValid = errors.length === 0;

  // --- HELPERS ---
  const toggleLanguage = (lang: string) => {
      const currentLangs = formData.languages;
      const newLangs = currentLangs.includes(lang) 
        ? currentLangs.filter(l => l !== lang) 
        : [...currentLangs, lang];
      handleArrayChange('languages', newLangs);
  };

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>, field: 'strengths' | 'weaknesses') => {
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          const val = e.currentTarget.value.trim();
          if (val && !formData[field].includes(val)) {
              handleArrayChange(field, [...formData[field], val]);
              e.currentTarget.value = "";
          }
      }
  };

  const removeTag = (tag: string, field: 'strengths' | 'weaknesses') => {
      handleArrayChange(field, formData[field].filter(t => t !== tag));
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
        
        {/* --- SECTION 1: ABOUT ME & LANGS --- */}
        <div>
             <h3 className={sectionHeaderStyle}>About Me & Skills</h3>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* About Me */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className={labelStyle}>Player Bio <span className="text-red-500">*</span></label>
                        <span className={`text-xs font-medium ${formData.bio.length > BIO_CHARACTER_LIMIT ? 'text-red-500' : 'text-gray-500'}`}>
                            {formData.bio.length} / {BIO_CHARACTER_LIMIT}
                        </span>
                    </div>
                    <textarea 
                        name="bio" 
                        rows={6} 
                        value={formData.bio} 
                        onChange={handleChange} 
                        maxLength={BIO_CHARACTER_LIMIT}
                        className={`${inputBaseStyle} resize-none h-[180px]`}
                        placeholder="Briefly describe your journey, achievements, and playing style..."
                    />
                </div>

                 {/* Languages */}
                <div>
                     <label className={labelStyle}>Languages Spoken <span className="text-red-500">*</span></label>
                     <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 h-[180px] overflow-y-auto custom-scrollbar">
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_LANGUAGES.map(lang => {
                                const isSelected = formData.languages.includes(lang);
                                return (
                                    <button
                                        key={lang} 
                                        type="button" 
                                        onClick={() => toggleLanguage(lang)}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5
                                            ${isSelected ? "bg-lime-500/20 border-lime-500 text-lime-500" : "bg-[#2C2C2C] border-gray-700 text-gray-400 hover:text-gray-200"}`}
                                    >
                                        {isSelected && <Check size={12} />} {lang}
                                    </button>
                                );
                            })}
                        </div>
                     </div>
                </div>
             </div>
        </div>

        {/* --- SECTION 2: SKILLS ANALYSIS --- */}
        <div>
            <h3 className={`${sectionHeaderStyle} mt-4`}>Skills Analysis</h3>
            
            {/* Pill Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <div>
                    <label className={labelStyle}>Strengths (Press Enter)</label>
                    <div className="bg-[#1a1a1a] p-3 rounded-md border border-gray-700 min-h-[50px] flex flex-wrap gap-2 items-center focus-within:border-lime-500/50 transition-colors">
                        {formData.strengths.map(tag => (
                            <span key={tag} className="bg-lime-900/30 text-lime-400 border border-lime-500/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                                {tag} <button type="button" onClick={() => removeTag(tag, 'strengths')} className="hover:text-white"><X size={12}/></button>
                            </span>
                        ))}
                        <input 
                            type="text" 
                            className="bg-transparent outline-none text-sm text-white flex-1 min-w-[100px]" 
                            placeholder="e.g. Speed, Agility, Leadership" 
                            onKeyDown={(e) => handleTagInput(e, 'strengths')} 
                        />
                    </div>
                </div>

                <div>
                    <label className={labelStyle}>Weaknesses (Press Enter)</label>
                    <div className="bg-[#1a1a1a] p-3 rounded-md border border-gray-700 min-h-[50px] flex flex-wrap gap-2 items-center focus-within:border-lime-500/50 transition-colors">
                        {formData.weaknesses.map(tag => (
                            <span key={tag} className="bg-red-900/20 text-red-400 border border-red-500/30 px-2 py-1 rounded text-xs flex items-center gap-1">
                                {tag} <button type="button" onClick={() => removeTag(tag, 'weaknesses')} className="hover:text-white"><X size={12}/></button>
                            </span>
                        ))}
                        <input 
                            type="text" 
                            className="bg-transparent outline-none text-sm text-white flex-1 min-w-[100px]" 
                            placeholder="e.g. Stamina, Backhand" 
                            onKeyDown={(e) => handleTagInput(e, 'weaknesses')} 
                        />
                    </div>
                </div>
            </div>

            {/* --- MANDATORY DESCRIPTIONS (ACCORDION) --- */}
            <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#151515]">
                <button 
                    type="button"
                    onClick={() => setShowDescriptions(!showDescriptions)}
                    className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-300 hover:bg-[#1f1f1f] transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span>Detailed Analysis (Required)</span>
                        {!formData.strengthDescription || !formData.weaknessDescription ? <span className="text-red-500 text-[10px] uppercase font-bold bg-red-900/20 px-2 py-0.5 rounded">Incomplete</span> : <span className="text-lime-500 text-[10px] uppercase font-bold bg-lime-900/20 px-2 py-0.5 rounded">Completed</span>}
                    </div>
                    {showDescriptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {showDescriptions && (
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-800 animate-in slide-in-from-top-2 duration-200">
                        <div>
                            <label className={labelStyle}>Strength Description <span className="text-red-500">*</span></label>
                            <textarea 
                                name="strengthDescription" 
                                value={formData.strengthDescription} 
                                onChange={handleChange} 
                                className={`${inputBaseStyle} resize-none h-[100px]`}
                                placeholder="Elaborate on your key strengths..."
                            />
                        </div>
                        <div>
                            <label className={labelStyle}>Weakness Description <span className="text-red-500">*</span></label>
                            <textarea 
                                name="weaknessDescription" 
                                value={formData.weaknessDescription} 
                                onChange={handleChange} 
                                className={`${inputBaseStyle} resize-none h-[100px]`}
                                placeholder="What are you currently working to improve?"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- SECTION 3: SOCIAL MEDIA --- */}
        <div>
             <h3 className={`${sectionHeaderStyle} mt-4`}>Social Media</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                     <label className={labelStyle}>Facebook</label>
                     <div className="flex">
                        <div className="bg-[#1e1e1e] border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center justify-center text-[#1877F2]">
                            <Facebook size={18} />
                        </div>
                        <input type="url" name="facebook" value={formData.socialLinks.facebook} onChange={handleSocialChange} className={`${inputBaseStyle} rounded-l-none`} placeholder="https://facebook.com/your-profile" />
                     </div>
                 </div>
                 <div>
                     <label className={labelStyle}>Instagram</label>
                     <div className="flex">
                        <div className="bg-[#1e1e1e] border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center justify-center text-[#E4405F]">
                            <Instagram size={18} />
                        </div>
                        <input type="url" name="instagram" value={formData.socialLinks.instagram} onChange={handleSocialChange} className={`${inputBaseStyle} rounded-l-none`} placeholder="https://instagram.com/your-handle" />
                     </div>
                 </div>
                 <div>
                     <label className={labelStyle}>Twitter (X)</label>
                     <div className="flex">
                        <div className="bg-[#1e1e1e] border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center justify-center text-white">
                            <Twitter size={18} />
                        </div>
                        <input type="url" name="twitter" value={formData.socialLinks.twitter} onChange={handleSocialChange} className={`${inputBaseStyle} rounded-l-none`} placeholder="https://x.com/your-handle" />
                     </div>
                 </div>
                 <div>
                     <label className={labelStyle}>LinkedIn</label>
                     <div className="flex">
                        <div className="bg-[#1e1e1e] border border-gray-700 border-r-0 rounded-l-md px-3 flex items-center justify-center text-[#0A66C2]">
                            <Linkedin size={18} />
                        </div>
                        <input type="url" name="linkedin" value={formData.socialLinks.linkedin} onChange={handleSocialChange} className={`${inputBaseStyle} rounded-l-none`} placeholder="https://linkedin.com/in/your-profile" />
                     </div>
                 </div>
             </div>
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800 items-center">
           <button type="button" onClick={onPreview} className="px-6 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide text-sm">Preview</button>
           
           <div className="flex gap-3">
                <button 
                    type="button" 
                    onClick={onPrevious} 
                    className="px-6 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-wide flex items-center gap-2 text-sm"
                >
                    <ArrowLeft size={16} /> Previous
                </button>
                
                <div className="relative" onMouseEnter={() => setHoverButton(true)} onMouseLeave={() => setHoverButton(false)}>
                    <button 
                        type="button" 
                        onClick={onNext} 
                        disabled={!isValid}
                        className={`px-8 py-2.5 rounded-md font-bold uppercase tracking-wide flex items-center gap-2 transition-all text-sm
                            ${!isValid ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600" : "bg-gradient-to-r from-lime-600 to-lime-500 text-black hover:brightness-110"}`
                        }
                    >
                        Next <ArrowRight size={16} />
                    </button>
                    
                    {/* Error Tooltip */}
                    {!isValid && hoverButton && (
                        <div className="absolute bottom-full right-0 mb-3 w-64 bg-red-900/90 text-white text-xs p-3 rounded-md border border-red-500 shadow-xl backdrop-blur-sm z-50 animate-in fade-in zoom-in">
                            <div className="flex items-center gap-2 mb-2 border-b border-red-500/30 pb-2 font-bold">
                                <AlertCircle size={14}/> Required Fields:
                            </div>
                            <ul className="list-disc pl-4 space-y-1 text-red-100/80">
                                {errors.map((e,i)=><li key={i}>{e}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
           </div>
        </div>
    </div>
  );
};

export default BioTab;