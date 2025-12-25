import React, { useState, useEffect } from "react";
import { ChevronDown, Info, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { FormData } from "../CreateProfile";

// Tooltip Helper
const InfoTooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block ml-2 align-middle">
      <button type="button" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className="text-gray-500 hover:text-lime-500 transition-colors focus:outline-none translate-y-[-1px]"><Info size={14} /></button>
      {visible && <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-gray-200 text-xs p-2 rounded border border-gray-700 shadow-xl z-20 text-center pointer-events-none animate-in fade-in zoom-in duration-200">{text} <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div></div>}
    </div>
  );
};

interface Props {
  formData: FormData;
  handleStatChange: (sport: string, field: string, value: string) => void;
  onPreview: () => void; onNext: () => void; onPrevious: () => void;
}

const SPORT_CONFIGS: Record<string, { label: string; name: string; tooltip?: string }[]> = {
    Badminton: [ { label: "Matches", name: "matchesPlayed" }, { label: "Wins", name: "wins" }, { label: "Loss", name: "loss" }, { label: "Draws", name: "draws" }, { label: "Aces", name: "aces" }, { label: "Smash Winners", name: "smashWinners" } ],
    Cricket: [ { label: "Matches", name: "matchesPlayed" }, { label: "Wins", name: "wins" }, { label: "Loss", name: "loss" }, { label: "Draws", name: "draws" }, { label: "Runs", name: "runsScored" }, { label: "Wickets", name: "wicketsTaken" } ],
    Football: [ { label: "Matches", name: "matchesPlayed" }, { label: "Wins", name: "wins" }, { label: "Loss", name: "loss" }, { label: "Draws", name: "draws" }, { label: "Goals", name: "goalsScored" }, { label: "Assists", name: "assists" } ],
    Tennis: [ { label: "Matches", name: "matchesPlayed" }, { label: "Wins", name: "wins" }, { label: "Loss", name: "loss" }, { label: "Draws", name: "draws" }, { label: "Aces", name: "aces" }, { label: "Break Pts", name: "smashWinners" } ],
    Squash: [ { label: "Matches", name: "matchesPlayed" }, { label: "Wins", name: "wins" }, { label: "Loss", name: "loss" }, { label: "Draws", name: "draws" }, { label: "Points", name: "aces" }, { label: "Nick Shots", name: "smashWinners" } ]
};

const SportsStatsTab: React.FC<Props> = ({ formData, handleStatChange, onPreview, onNext, onPrevious }) => {
  
  // Logic to handle empty sports
  const availableSports = formData.sports.length > 0 ? formData.sports : ["Badminton"]; 
  const [selectedSport, setSelectedSport] = useState(availableSports[0]);
  
  const activeFields = SPORT_CONFIGS[selectedSport] || SPORT_CONFIGS["Badminton"];
  const currentStats = formData.sportStats[selectedSport] || {}; // Access Nested Stats

  const [validationMsg, setValidationMsg] = useState<{ type: 'error' | 'warning' | 'success', text: string } | null>(null);

  // Validate Logic for CURRENTLY selected sport
  useEffect(() => {
    const matches = parseInt(currentStats.matchesPlayed) || 0;
    const wins = parseInt(currentStats.wins) || 0;
    const loss = parseInt(currentStats.loss) || 0;
    const draws = parseInt(currentStats.draws) || 0;
    const total = wins + loss + draws;

    if (matches > 0) {
        if (total > matches) setValidationMsg({ type: 'error', text: `Math Error: Wins+Loss+Draws (${total}) > Matches (${matches})` });
        else if (total < matches) setValidationMsg({ type: 'warning', text: `Note: ${matches - total} matches unaccounted for.` });
        else setValidationMsg({ type: 'success', text: `Perfect! Math checks out.` });
    } else {
        setValidationMsg(null);
    }
  }, [currentStats, selectedSport]);

  const isNextDisabled = validationMsg?.type === 'error';

  if (formData.sports.length === 0) {
      return (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
              <Info size={40} className="mb-4 opacity-50"/>
              <p>No sports selected in Personal Info.</p>
              <button onClick={onPrevious} className="mt-4 text-lime-500 hover:underline">Go back to select sports</button>
          </div>
      )
  }

  return (
    <div className="animate-in fade-in duration-300">
        
        {/* Sport Selector - Only shows CHOSEN sports */}
        <div className="flex justify-end mb-6">
            <div className="relative w-48">
                <span className="absolute -top-5 left-0 text-[#a3a3a3] text-xs font-medium">Editing Stats For :</span>
                <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="w-full bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md outline-none border border-gray-700 appearance-none focus:border-lime-500">
                    {availableSports.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
            </div>
        </div>

        {validationMsg && (
            <div className={`mb-6 p-3 rounded-md text-xs flex items-center gap-2 border transition-all duration-300 ${validationMsg.type === 'error' ? 'bg-red-900/20 border-red-900/50 text-red-400' : validationMsg.type === 'warning' ? 'bg-yellow-900/20 border-yellow-900/50 text-yellow-400' : 'bg-lime-900/20 border-lime-900/50 text-lime-400'}`}>
                {validationMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {validationMsg.text}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFields.map((field) => (
                <div key={field.name} className="bg-[#0f0f0f] p-6 rounded-lg border border-gray-800 shadow-md hover:border-gray-700 transition-colors relative group">
                    <div className="flex items-center gap-2 mb-6">
                        <h4 className="text-[#d9f99d] text-lg font-medium">{field.label}</h4>
                        {field.tooltip && <InfoTooltip text={field.tooltip} />}
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm font-medium">Count</span>
                        <input 
                            type="number" min="0"
                            value={currentStats[field.name] || ""} 
                            onChange={(e) => handleStatChange(selectedSport, field.name, e.target.value)}
                            className="w-24 bg-[#2C2C2C] text-white rounded px-3 py-1.5 outline-none border border-transparent focus:border-lime-500/50 text-center font-mono focus:bg-[#333] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800 items-center">
           <button type="button" onClick={onPreview} className="px-6 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide text-sm">Preview</button>
           <div className="flex gap-3">
                <button type="button" onClick={onPrevious} className="px-6 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-wide flex items-center gap-2 text-sm"><ArrowLeft size={16} /> Previous</button>
                <button type="button" onClick={onNext} disabled={isNextDisabled} className={`px-8 py-2.5 rounded-md font-bold uppercase tracking-wide flex items-center gap-2 transition-all text-sm ${isNextDisabled ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600" : "bg-gradient-to-r from-lime-600 to-lime-500 text-black hover:brightness-110"}`}>Next <ArrowRight size={16} /></button>
           </div>
        </div>
    </div>
  );
};

export default SportsStatsTab;