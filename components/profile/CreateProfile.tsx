"use client";

import React, { useState, ChangeEvent, useMemo, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileFooter from "./ProfileFooter";
import PersonalInfoTab from "./tabs/PersonalInfoTab";
import SportsStatsTab from "./tabs/SportsStatsTab";
import BioTab from "./tabs/BioTab";
import ParticipationTab from "./tabs/ParticipationTab";
import AchievementsTab from "./tabs/AchievementsTab";
import MediaTab from "./tabs/MediaTab";
import PreviewModal from "./modals/PreviewModal";
import IdentityModal from "./modals/IdentityModal";
import ProfileSummary from "./ProfileSummary";
import { useProfile } from "@/hooks/useProfile";
import { useUpload } from "@/hooks/useUpload";

// --- Shared Types ---
export interface SportStatsData {
  matchesPlayed: string;
  wins: string;
  loss: string;
  draws: string;
  [key: string]: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'certificate' | 'link';
  url: string;
  caption?: string;
  thumbnail?: string;
  publicId?: string; // Added for Cloudinary
}

export interface ParticipationRecord {
  id: string;
  tournamentName: string;
  level: string;
  date: string;
  location: string;
  result: string;
  // NEW: Event-specific Media & Story
  story?: string;
  media?: MediaItem[];
}

export interface AchievementRecord {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  certificateUrl: string | null;
  certificateName: string | null;
  publicId?: string; // Added for Cloudinary
}

export interface FormData {
  fullName: string; dob: string;
  sports: string[];
  contactNo: string; countryCode: string; gender: string; email: string; nationality: string; address: string;
  height: string; weight: string; dominantHand: string; disability: string; disabilityDesc: string; wingspan: string; agilityRating: string;
  sportStats: Record<string, SportStatsData>;
  bio: string; languages: string[]; strengths: string[]; strengthDescription: string; weaknesses: string[]; weaknessDescription: string; socialLinks: { facebook: string; instagram: string; twitter: string; linkedin: string; };
  participations: ParticipationRecord[];
  achievements: AchievementRecord[];

  // General Media (Profile Highlights)
  media: MediaItem[];
  playerJourney: string;

  // Identity & Meta
  profilePicUrl?: string;
  identityFileUrl?: string;
  identityFileName?: string;
  identityFilePublicId?: string;
  shareableSlug?: string;
}

export interface Units { height: "cm" | "ft"; weight: "kg" | "lbs"; }
export interface IdentityFile { name: string; url: string; type: string; publicId?: string; }

const TABS = ["PERSONAL INFO", "SPORTS STATS", "BIO", "PARTICIPATION", "ACHIEVEMENTS", "MEDIA"];

const getDefaultFormData = (): FormData => ({
  fullName: "", dob: "", sports: [], contactNo: "", countryCode: "+91", gender: "", email: "", nationality: "Indian", address: "",
  height: "", weight: "", dominantHand: "", disability: "No", disabilityDesc: "", wingspan: "", agilityRating: "",
  sportStats: {},
  bio: "", languages: [], strengths: [], strengthDescription: "", weaknesses: [], weaknessDescription: "", socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" },
  participations: [],
  achievements: [],
  media: [],
  playerJourney: ""
});

const CreateProfile = () => {
  const { fetchProfile, saveProfile, loading: dbLoading } = useProfile();
  const { upload, uploading, progress } = useUpload();

  const [activeTab, setActiveTab] = useState("PERSONAL INFO");
  const [furthestStep, setFurthestStep] = useState(0);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>(getDefaultFormData());
  const [units, setUnits] = useState<Units>({ height: "cm", weight: "kg" });
  // BMI computed from form data and units
  const bmi = useMemo(() => {
    const h = parseFloat(formData.height); const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) {
      const hM = units.height === "cm" ? h / 100 : h * 0.3048;
      const wKg = units.weight === "kg" ? w : w * 0.453592;
      const bmiVal = parseFloat((wKg / (hM * hM)).toFixed(1));
      let s = "Normal", c = "text-lime-500";
      if (bmiVal < 18.5) { s = "Underweight"; c = "text-red-500"; }
      else if (bmiVal >= 25 && bmiVal < 30) { s = "Overweight"; c = "text-yellow-500"; }
      else if (bmiVal >= 30) { s = "Obesity"; c = "text-red-500"; }
      return { value: bmiVal.toString(), status: s, color: c };
    } else {
      return { value: "", status: "", color: "text-gray-500" };
    }
  }, [formData.height, formData.weight, units]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [identityFile, setIdentityFile] = useState<IdentityFile | null>(null);
  const [modals, setModals] = useState({ preview: false, identity: false });
  const [showSummary, setShowSummary] = useState(false);

  // Load saved data on mount
  const PLAYER_PROFILE_DRAFT_KEY = 'player_profile_draft';

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      let dbProfile: FormData | null = null;

      // 1. Try to fetch from DB
      try {
        dbProfile = await fetchProfile();

        if (dbProfile) {
          const profile = dbProfile; // Non-null assertion through assignment
          setFormData(prev => ({
            ...getDefaultFormData(),
            ...prev,
            ...profile,
            // Ensure arrays are initialized
            sports: profile.sports || [],
            languages: profile.languages || [],
            strengths: profile.strengths || [],
            weaknesses: profile.weaknesses || [],
            media: profile.media || [],
            participations: profile.participations || [],
            achievements: profile.achievements || [],
          }));

          setUnits({
            height: profile.height && profile.height.includes('ft') ? 'ft' : 'cm',
            weight: profile.weight && profile.weight.includes('lbs') ? 'lbs' : 'kg'
          });

          if (profile.profilePicUrl) {
            setProfilePic(profile.profilePicUrl);
          }

          if (profile.identityFileUrl) {
            setIdentityFile({
              name: profile.identityFileName || 'Identity Proof',
              url: profile.identityFileUrl,
              type: 'application/pdf',
              publicId: profile.identityFilePublicId
            });
          }

          // Ensure completed status if shareable slug exists
          if (profile.shareableSlug) {
            setProfileCompleted(true);
            setShowSummary(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch from DB:", error);
      }

      // 2. If no DB profile, check localStorage for draft
      if (!dbProfile) { // Removed `&& !hasProfile` as `hasProfile` is not defined in this scope
        const savedDraft = localStorage.getItem(PLAYER_PROFILE_DRAFT_KEY);
        if (savedDraft) {
          try {
            const { formData: draftData, units: draftUnits, activeTab: draftTab } = JSON.parse(savedDraft);
            // Merge with default to ensure structural integrity
            setFormData(prev => ({
              ...getDefaultFormData(),
              ...prev,
              ...draftData,
              sports: draftData.sports || [],
              languages: draftData.languages || [],
              strengths: draftData.strengths || [],
              weaknesses: draftData.weaknesses || [],
              media: draftData.media || [],
              participations: draftData.participations || [],
              achievements: draftData.achievements || [],
            }));

            if (draftUnits) setUnits(draftUnits);
            if (draftTab) {
              setActiveTab(draftTab);
              const tabIndex = TABS.indexOf(draftTab);
              if (tabIndex > 0) setFurthestStep(tabIndex);
            }
            if (draftData.profilePicUrl) setProfilePic(draftData.profilePicUrl);

            if (draftData.identityFileUrl) {
              setIdentityFile({
                name: draftData.identityFileName || 'Identity Proof',
                url: draftData.identityFileUrl,
                type: 'application/pdf',
                publicId: draftData.identityFilePublicId
              });
            }

          } catch (e) {
            console.error("Failed to parse draft:", e);
            localStorage.removeItem(PLAYER_PROFILE_DRAFT_KEY);
          }
        }
      }

      setInitialLoading(false);
    };

    loadData();
  }, [fetchProfile]); // Removed `hasProfile` from dependency array as it's not defined in this scope

  // Auto-save draft on form changes (debounced)
  useEffect(() => {
    if (initialLoading || dbLoading || profileCompleted) return;

    const timeoutId = setTimeout(() => {
      // Save to localStorage
      const draftState = {
        formData,
        units,
        activeTab
      };
      localStorage.setItem(PLAYER_PROFILE_DRAFT_KEY, JSON.stringify(draftState));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, units, activeTab, initialLoading, profileCompleted, dbLoading]);

  // Handle profile submission
  const handleProfileSubmit = async () => {
    // Basic validation check before submit
    if (!formData.fullName || !formData.email) {
      alert("Please ensure all required fields (Name, Email) are filled.");
      return;
    }

    try {
      const result = await saveProfile(formData);

      if (result.success) {
        // Extract slug from shareableUrl (format: /profile/slug)
        const slug = result.shareableUrl?.split('/').pop();
        if (slug) {
          setFormData(prev => ({ ...prev, shareableSlug: slug }));
        }

        setProfileCompleted(true);
        setShowSummary(true);
        // Clear draft on successful save
        localStorage.removeItem(PLAYER_PROFILE_DRAFT_KEY);
        alert("Profile saved successfully!");
      } else {
        console.error("Profile save failed", result);
        alert(`Failed to save profile: ${result.error || 'Unknown error'}. Please try again.`);
      }
    } catch (e) {
      console.error("Submit error:", e);
      alert("An error occurred during submission.");
    }
  };


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

  const handleStatChange = (sport: string, field: string, value: string) => {
    setFormData(prev => ({ ...prev, sportStats: { ...prev.sportStats, [sport]: { ...(prev.sportStats[sport] || {}), [field]: value } } }));
  };

  const handleNationalityChange = (nationality: string, code: string) => {
    setFormData(prev => ({ ...prev, nationality, countryCode: code }));
  }

  const handleUnitChange = (type: "height" | "weight", value: string) => {
    setUnits((prev) => ({ ...prev, [type]: value }));
  };

  // --- Participation Handlers ---
  const handleAddParticipation = (record: ParticipationRecord) => {
    setFormData(prev => ({ ...prev, participations: [...prev.participations, record] }));
  }
  const handleRemoveParticipation = (id: string) => {
    setFormData(prev => ({ ...prev, participations: prev.participations.filter(p => p.id !== id) }));
  }

  // NEW: Update a specific event's media/story
  const handleEventUpdate = (eventId: string, updates: Partial<ParticipationRecord>) => {
    setFormData(prev => ({
      ...prev,
      participations: prev.participations.map(p => p.id === eventId ? { ...p, ...updates } : p)
    }));
  }

  const handleAddAchievement = (record: AchievementRecord) => {
    setFormData(prev => ({ ...prev, achievements: [...prev.achievements, record] }));
  }
  const handleRemoveAchievement = (id: string) => {
    setFormData(prev => ({ ...prev, achievements: prev.achievements.filter(a => a.id !== id) }));
  }

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
    if (targetIndex <= furthestStep) { setActiveTab(tab); }
  };


  const handleFile = async (e: ChangeEvent<HTMLInputElement>, type: 'photo' | 'identity') => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      try {
        // Upload to Cloudinary
        const result = await upload(file, type === 'photo' ? 'player-photos' : 'identity-proofs');

        if (type === 'photo') {
          setProfilePic(result.url);
          setFormData(prev => ({
            ...prev,
            profilePicUrl: result.url,
            profilePicPublicId: result.publicId
          }));
        } else {
          setIdentityFile({
            name: result.fileName,
            url: result.url,
            type: result.fileType,
            publicId: result.publicId
          });
          setFormData(prev => ({
            ...prev,
            identityFileUrl: result.url,
            identityFileName: result.fileName,
            identityFilePublicId: result.publicId
          }));
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("File upload failed. Please try again.");
      }
    }
  };

  // Show loading spinner while checking localStorage
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-gray-700 border-t-lime-500 animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If showing summary, render the ProfileSummary component
  if (showSummary) {
    return (
      <ProfileSummary
        data={formData}
        bmiData={bmi}
        image={profilePic}
        units={units}
        onEdit={() => {
          // Allow editing - this goes back to form without clearing completed status
          setShowSummary(false);
          setProfileCompleted(false); // Allow draft saving during edit
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-gray-300 flex flex-col">
      <PreviewModal
        isOpen={modals.preview}
        onClose={() => setModals({ ...modals, preview: false })}
        data={formData}
        bmiData={bmi}
        image={profilePic}
        units={units}
        activeTab={activeTab}
        onUpdateMedia={(newMedia) => setFormData(prev => ({ ...prev, media: newMedia }))}
        onUpdateEvent={handleEventUpdate}
      />
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
                <button key={tab} onClick={() => handleTabClick(tab)} disabled={!isAccessible} className={`px-6 py-4 text-xs md:text-sm font-bold tracking-wide transition-colors relative ${isActive ? "text-lime-500" : isAccessible ? "text-gray-400 hover:text-gray-200 cursor-pointer" : "text-gray-700 cursor-not-allowed"}`}>
                  {tab}
                  {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-lime-500" />}
                </button>
              )
            })}
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            {activeTab === "PERSONAL INFO" ? (
              <PersonalInfoTab formData={formData} handleChange={handleInputChange} handleUnitChange={handleUnitChange} handleNationalityChange={handleNationalityChange} handleArrayChange={handleArrayChange} units={units} bmi={bmi} profilePic={profilePic} identityFile={identityFile} onPhotoUpload={(e) => handleFile(e, 'photo')} onPhotoRemove={() => setProfilePic(null)} onIdentityUpload={(e) => handleFile(e, 'identity')} onIdentityPreview={() => setModals({ ...modals, identity: true })} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext} />
            ) : activeTab === "SPORTS STATS" ? (
              <SportsStatsTab formData={formData} handleStatChange={handleStatChange} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext} onPrevious={handlePrevious} />
            ) : activeTab === "BIO" ? (
              <BioTab formData={formData} handleChange={handleInputChange} handleSocialChange={handleSocialChange} handleArrayChange={handleArrayChange} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext} onPrevious={handlePrevious} />
            ) : activeTab === "PARTICIPATION" ? (
              <ParticipationTab participations={formData.participations} onAdd={handleAddParticipation} onRemove={handleRemoveParticipation} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext} onPrevious={handlePrevious} />
            ) : activeTab === "ACHIEVEMENTS" ? (
              <AchievementsTab achievements={formData.achievements} onAdd={handleAddAchievement} onRemove={handleRemoveAchievement} onPreview={() => setModals({ ...modals, preview: true })} onNext={handleNext} onPrevious={handlePrevious} />
            ) : activeTab === "MEDIA" ? (
              <MediaTab
                media={formData.media}
                playerJourney={formData.playerJourney}
                participations={formData.participations}
                onUpdateMedia={(newMedia) => setFormData(prev => ({ ...prev, media: newMedia }))}
                onUpdateJourney={(text) => setFormData(prev => ({ ...prev, playerJourney: text }))}
                onUpdateEvent={handleEventUpdate}
                onPreview={() => setModals({ ...modals, preview: true })}
                onPrevious={handlePrevious}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProfileSubmit();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : null}
          </div>
        </div>
      </main>
      <ProfileFooter />
    </div>
  );
};

export default CreateProfile;