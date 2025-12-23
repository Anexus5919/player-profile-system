import React, { useState, useEffect } from "react";
import { ChevronDown, Info, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { FormData } from "../CreateProfile";

// Tooltip Helper
const InfoTooltip = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block ml-2 align-middle">
      <button 
        type="button" 
        onMouseEnter={() => setVisible(true)} 
        onMouseLeave={() => setVisible(false)} 
        className="text-gray-500 hover:text-lime-500 transition-colors focus:outline-none translate-y-[-1px]"
      >
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
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPreview: () => void;
  onNext: () => void;
}

const SPORT_CONFIGS: Record<string, { label: string; name: keyof FormData; tooltip?: string }[]> = {
    Badminton: [
        { label: "Matches Played", name: "matchesPlayed" },
        { label: "Wins", name: "wins" },
        { label: "Loss", name: "loss" },
        { label: "Draws/Tie", name: "draws" },
        { label: "Aces", name: "aces", tooltip: "A legal serve that is not touched by the receiver." },
        { label: "Smash Winners", name: "smashWinners", tooltip: "Winning points scored directly from a smash." },
    ],
    Cricket: [
        { label: "Matches Played", name: "matchesPlayed" },
        { label: "Wins", name: "wins" },
        { label: "Loss", name: "loss" },
        { label: "Draws/Tie", name: "draws" },
        { label: "Total Runs", name: "runsScored", tooltip: "Total runs scored in the season/career." },
        { label: "Wickets Taken", name: "wicketsTaken", tooltip: "Total wickets taken as a bowler." },
    ],
    Football: [
        { label: "Matches Played", name: "matchesPlayed" },
        { label: "Wins", name: "wins" },
        { label: "Loss", name: "loss" },
        { label: "Draws", name: "draws" },
        { label: "Goals Scored", name: "goalsScored", tooltip: "Total goals scored." },
        { label: "Assists", name: "assists", tooltip: "Passes that directly led to a goal." },
    ]
};

const SportsStatsTab: React.FC<Props> = ({ formData, handleChange, onPreview, onNext }) => {
  const activeFields = SPORT_CONFIGS[formData.statsSport] || SPORT_CONFIGS["Badminton"];
  const [validationMsg, setValidationMsg] = useState<{ type: 'error' | 'warning' | 'success', text: string } | null>(null);

  // --- CORE LOGIC VALIDATION ---
  useEffect(() => {
    const matches = parseInt(formData.matchesPlayed) || 0;
    const wins = parseInt(formData.wins) || 0;
    const loss = parseInt(formData.loss) || 0;
    const draws = parseInt(formData.draws) || 0;
    const total = wins + loss + draws;

    if (matches > 0) {
        if (total > matches) {
            setValidationMsg({ 
                type: 'error', 
                text: `Math Error: Wins(${wins}) + Loss(${loss}) + Draws(${draws}) = ${total}. This exceeds Matches Played (${matches}).` 
            });
        } else if (total < matches) {
            setValidationMsg({ 
                type: 'warning', 
                text: `Note: The sum of results (${total}) is less than Matches Played (${matches}). Some games are unaccounted for.` 
            });
        } else {
            setValidationMsg({ 
                type: 'success', 
                text: `Perfect! Wins + Loss + Draws equals Matches Played (${matches}).` 
            });
        }
    } else {
        setValidationMsg(null);
    }
  }, [formData.matchesPlayed, formData.wins, formData.loss, formData.draws]);

  // Disable Next if there is a critical error
  const isNextDisabled = validationMsg?.type === 'error';

  return (
    <div className="animate-in fade-in duration-300">
        {/* Sport Selector */}
        <div className="flex justify-end mb-6">
            <div className="relative w-48">
                <span className="absolute -top-5 left-0 text-[#a3a3a3] text-xs font-medium">Select Sport :</span>
                <select name="statsSport" value={formData.statsSport} onChange={handleChange} className="w-full bg-[#1a1a1a] text-white text-sm px-3 py-2 rounded-md outline-none border border-gray-700 appearance-none focus:border-lime-500">
                    <option value="Badminton">Badminton</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Squash">Squash</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-500 pointer-events-none" size={16} />
            </div>
        </div>

        {/* Validation Message Banner */}
        {validationMsg && (
            <div className={`mb-6 p-3 rounded-md text-xs flex items-center gap-2 border 
                ${validationMsg.type === 'error' ? 'bg-red-900/20 border-red-900/50 text-red-400' : 
                  validationMsg.type === 'warning' ? 'bg-yellow-900/20 border-yellow-900/50 text-yellow-400' : 
                  'bg-lime-900/20 border-lime-900/50 text-lime-400'}`}
            >
                {validationMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {validationMsg.text}
            </div>
        )}

        {/* Stats Grid */}
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
                            type="number"
                            min="0"
                            name={field.name} 
                            value={(formData as any)[field.name]} 
                            onChange={handleChange}
                            className="w-24 bg-[#2C2C2C] text-white rounded px-3 py-1.5 outline-none border border-transparent focus:border-lime-500/50 text-center font-mono focus:bg-[#333]"
                            placeholder="0"
                        />
                    </div>
                </div>
            ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800">
           <button type="button" onClick={onPreview} className="px-8 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide">Preview</button>
           
           <button 
                type="button" 
                onClick={onNext}
                disabled={isNextDisabled}
                className={`px-10 py-2.5 rounded-md font-bold uppercase tracking-wide flex items-center gap-2 transition-all
                    ${isNextDisabled 
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600" 
                        : "bg-gradient-to-r from-lime-600 to-lime-500 text-black hover:brightness-110"}`
                }
            >
                Next <ArrowRight size={18} />
            </button>
        </div>
    </div>
  );
};

export default SportsStatsTab;