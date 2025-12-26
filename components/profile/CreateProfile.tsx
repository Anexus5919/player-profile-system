"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileFooter from "./ProfileFooter";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import SportsStatsTab from "./tabs/SportsStatsTab";
import BioTab from "./tabs/BioTab";
// 1. IMPORT NEW TAB
import ParticipationTab from "./tabs/ParticipationTab";
import PreviewModal from "./modals/PreviewModal";
import IdentityModal from "./modals/IdentityModal";

// --- Shared Types ---
export interface SportStatsData {
  matchesPlayed: string;
  wins: string;
  loss: string;
  draws: string;
  [key: string]: string; // Allow dynamic keys
}

// --- NEW TYPE FOR PARTICIPATION ---
export interface ParticipationRecord {
    id: string; 
    tournamentName: string;
    level: string; // District, State, National
    date: string;
    location: string;
    result: string; // Winner, Runner Up, Participant
}

export interface FormData {
  // Personal
  fullName: string; dob: string; 
  sports: string[]; // Array for multiple sports
  contactNo: string; countryCode: string; gender: string; email: string; nationality: string; address: string;
  // Physical
  height: string; weight: string; dominantHand: string; disability: string; disabilityDesc: string; wingspan: string; agilityRating: string;
  // Stats (Nested Object)
  sportStats: Record<string, SportStatsData>; 
  // Bio
  bio: string;
  languages: string[];
  strengths: string[];
  strengthDescription: string; 
  weaknesses: string[];
  weaknessDescription: string; 
  socialLinks: { facebook: string; instagram: string; twitter: string; linkedin: string; };
  // --- NEW FIELD ---
  participations: ParticipationRecord[];
}

export interface Units { height: "cm" | "ft"; weight: "kg" | "lbs"; }
export interface IdentityFile { name: string; url: string; type: string; }

const TABS = ["PERSONAL INFO", "SPORTS STATS", "BIO", "PARTICIPATION", "ACHIEVEMENTS", "MEDIA"];

const CreateProfile = () => {
  // --- Global State ---
  const [activeTab, setActiveTab] = useState("PERSONAL INFO");
  const [furthestStep, setFurthestStep] = useState(0); 

  const [formData, setFormData] = useState<FormData>({
    fullName: "", dob: "", 
    sports: [], // Start empty
    contactNo: "", countryCode: "+91", gender: "", email: "", nationality: "Indian", address: "",
    height: "", weight: "", dominantHand: "", disability: "No", disabilityDesc: "", wingspan: "", agilityRating: "",
    // Nested Stats Object
    sportStats: {}, 
    bio: "",
    languages: [],
    strengths: [],
    strengthDescription: "", 
    weaknesses: [],
    weaknessDescription: "", 
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
    // Initialize empty array for participations
    participations: []
  });
  
  const [units, setUnits] = useState<Units>({ height: "cm", weight: "kg" });
  const [bmi, setBmi] = useState({ value: "", status: "", color: "text-gray-500" });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [identityFile, setIdentityFile] = useState<IdentityFile | null>(null);
  const [modals, setModals] = useState({ preview: false, identity: false });

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "contactNo" && !/^\d*$/.test(value)) return; 
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [name]: value } }));
  };

  const handleArrayChange = (fieldName: keyof FormData, newArray: string[]) => {
      setFormData(prev => ({ ...prev, [fieldName]: newArray }));
  }

  // Handle Nested Stats Update
  const handleStatChange = (sport: string, field: string, value: string) => {
      setFormData(prev => ({
          ...prev,
          sportStats: {
              ...prev.sportStats,
              [sport]: {
                  ...(prev.sportStats[sport] || {}), 
                  [field]: value
              }
          }
      }));
  };

  const handleNationalityChange = (nationality: string, code: string) => {
      setFormData(prev => ({ ...prev, nationality, countryCode: code }));
  }

  const handleUnitChange = (type: "height" | "weight", value: string) => {
    setUnits((prev) => ({ ...prev, [type]: value }));
  };

  // --- NEW HANDLERS FOR PARTICIPATION ---
  const handleAddParticipation = (record: ParticipationRecord) => {
      setFormData(prev => ({ ...prev, participations: [...prev.participations, record] }));
  }

  const handleRemoveParticipation = (id: string) => {
      setFormData(prev => ({ ...prev, participations: prev.participations.filter(p => p.id !== id) }));
  }

  // --- Navigation Handlers ---
  const handleNext = () => {
    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex < TABS.length - 1) {
        const nextIndex = currentIndex + 1;
        setActiveTab(TABS[nextIndex]);
        if (nextIndex > furthestStep) setFurthestStep(nextIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex > 0) {
        setActiveTab(TABS[currentIndex - 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTabClick = (tab: string) => {
      const targetIndex = TABS.indexOf(tab);
      if (targetIndex <= furthestStep) {
          setActiveTab(tab);
      }
  };

  // BMI Calculation
  useEffect(() => {
    const h = parseFloat(formData.height);
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      let hM = units.height === "cm" ? h / 100 : h * 0.3048;
      let wKg = units.weight === "kg" ? w : w * 0.453592;
      const bmiVal = parseFloat((wKg / (hM * hM)).toFixed(1));
      let s = "Normal", c = "text-lime-500";
      if (bmiVal < 18.5) { s = "Underweight"; c = "text-red-500"; }
      else if (bmiVal >= 25 && bmiVal < 30) { s = "Overweight"; c = "text-yellow-500"; }
      else if (bmiVal >= 30) { s = "Obesity"; c = "text-red-500"; }
      setBmi({ value: bmiVal.toString(), status: s, color: c });
    } else {
      setBmi({ value: "", status: "", color: "text-gray-500" });
    }
  }, [formData.height, formData.weight, units]);

  const handleFile = (e: ChangeEvent<HTMLInputElement>, type: 'photo' | 'identity') => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      if (type === 'photo') setProfilePic(url);
      else setIdentityFile({ name: file.name, url, type: file.type });
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-gray-300 flex flex-col">
      <PreviewModal isOpen={modals.preview} onClose={() => setModals({ ...modals, preview: false })} data={formData} bmiData={bmi} image={profilePic} units={units} activeTab={activeTab} />
      <IdentityModal isOpen={modals.identity} onClose={() => setModals({ ...modals, identity: false })} file={identityFile} />

      <ProfileHeader />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-lime-500 mb-2 uppercase">Create Your Profile</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl">Enter personal details, physical stats, and sports information.</p>
        </div>

        <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <div className="flex flex-wrap border-b border-gray-700 bg-[#121212]">
            {TABS.map((tab, index) => {
              const isActive = activeTab === tab;
              const isAccessible = index <= furthestStep;
              return (
                <button 
                    key={tab} 
                    onClick={() => handleTabClick(tab)} 
                    disabled={!isAccessible}
                    className={`px-6 py-4 text-xs md:text-sm font-bold tracking-wide transition-colors relative 
                        ${isActive ? "text-lime-500" : isAccessible ? "text-gray-400 hover:text-gray-200 cursor-pointer" : "text-gray-700 cursor-not-allowed"}
                    `}
                >
                    {tab}
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lime-500" />}
                </button>
              )
            })}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert("Profile Submitted Successfully!"); }} className="p-6 md:p-8 lg:p-10">
            {activeTab === "PERSONAL INFO" ? (
              <PersonalInfoTab 
                formData={formData} handleChange={handleInputChange} handleUnitChange={handleUnitChange} handleNationalityChange={handleNationalityChange} handleArrayChange={handleArrayChange} units={units} bmi={bmi} profilePic={profilePic} identityFile={identityFile} onPhotoUpload={(e) => handleFile(e, 'photo')} onPhotoRemove={() => setProfilePic(null)} onIdentityUpload={(e) => handleFile(e, 'identity')} onIdentityPreview={() => setModals({ ...modals, identity: true })} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext}
              />
            ) : activeTab === "SPORTS STATS" ? (
              <SportsStatsTab 
                formData={formData} handleStatChange={handleStatChange} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext} onPrevious={handlePrevious}
              />
            ) : activeTab === "BIO" ? (
              <BioTab 
                formData={formData}
                handleChange={handleInputChange}
                handleSocialChange={handleSocialChange}
                handleArrayChange={handleArrayChange}
                onPreview={() => setModals({ ...modals, preview: true })}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            ) : activeTab === "PARTICIPATION" ? (
              // --- RENDER PARTICIPATION TAB ---
              <ParticipationTab 
                participations={formData.participations}
                onAdd={handleAddParticipation}
                onRemove={handleRemoveParticipation}
                onPreview={() => setModals({ ...modals, preview: true })}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-6">
                  <p className="text-xl font-medium">Content for {activeTab} section coming soon...</p>
                  {activeTab === "MEDIA" && (
                      <div className="text-center">
                          <button type="submit" className="px-10 py-2.5 rounded-md bg-gradient-to-r from-lime-600 to-lime-500 text-black font-bold hover:brightness-110 transition-all uppercase tracking-wide shadow-[0_0_15px_rgba(132,204,22,0.4)]">Submit Profile</button>
                      </div>
                  )}
                  <button type="button" onClick={handlePrevious} className="px-6 py-2 rounded-md bg-gray-800 text-gray-300 hover:text-white">Back</button>
              </div>
            )}
          </form>
        </div>
      </main>
      <ProfileFooter />
    </div>
  );
};

export default CreateProfile;