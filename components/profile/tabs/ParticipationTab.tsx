import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, Trash2, Trophy, MapPin, Calendar, Award, AlertCircle } from "lucide-react";
import { ParticipationRecord } from "../CreateProfile";

// --- STYLES ---
const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";

interface Props {
  participations: ParticipationRecord[];
  onAdd: (record: ParticipationRecord) => void;
  onRemove: (id: string) => void;
  onPreview: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ParticipationTab: React.FC<Props> = ({ participations, onAdd, onRemove, onPreview, onNext, onPrevious }) => {
  
  // Local state for the "Add New" form
  const [newEntry, setNewEntry] = useState<ParticipationRecord>({
      id: "",
      tournamentName: "",
      level: "",
      date: "",
      location: "",
      result: ""
  });

  const [isAdding, setIsAdding] = useState(false); // Controls if the form is visible
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewEntry(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
      // Validation
      if (!newEntry.tournamentName.trim() || !newEntry.level || !newEntry.date || !newEntry.result) {
          setError("Please fill all required fields.");
          return;
      }

      onAdd({ ...newEntry, id: Date.now().toString() });
      
      // Reset form
      setNewEntry({ id: "", tournamentName: "", level: "", date: "", location: "", result: "" });
      setIsAdding(false);
      setError(null);
  };

  // Determine if we can proceed (Next is disabled if user is currently typing a new entry but hasn't saved)
  const canProceed = !isAdding;

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
        
        <div className="flex justify-between items-end border-b border-gray-800 pb-4">
            <div>
                <h3 className="text-white font-bold text-lg uppercase">Tournament History</h3>
                <p className="text-gray-400 text-xs mt-1">Add details of tournaments you have participated in.</p>
            </div>
            {!isAdding && (
                <button 
                    type="button" 
                    onClick={() => setIsAdding(true)}
                    className="bg-lime-500/10 text-lime-500 border border-lime-500/50 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-lime-500 hover:text-black transition-all"
                >
                    <Plus size={16} /> Add Entry
                </button>
            )}
        </div>

        {/* --- ADD ENTRY FORM --- */}
        {isAdding && (
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-lime-500/30 shadow-lg animate-in slide-in-from-top-2">
                <h4 className="text-lime-500 font-bold uppercase text-xs mb-4 tracking-wider flex items-center gap-2">
                    <Trophy size={14} /> New Tournament Entry
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div><label className={labelStyle}>Tournament Name <span className="text-red-500">*</span></label><input type="text" name="tournamentName" value={newEntry.tournamentName} onChange={handleChange} className={inputBaseStyle} placeholder="e.g. State Championship 2024" /></div>
                    <div><label className={labelStyle}>Level <span className="text-red-500">*</span></label><select name="level" value={newEntry.level} onChange={handleChange} className={inputBaseStyle}><option value="">Select Level</option><option value="Inter-College">Inter-College</option><option value="District">District</option><option value="State">State</option><option value="National">National</option><option value="International">International</option></select></div>
                    <div><label className={labelStyle}>Date <span className="text-red-500">*</span></label><input type="date" name="date" value={newEntry.date} onChange={handleChange} className={`${inputBaseStyle} [color-scheme:dark]`} max={new Date().toISOString().split("T")[0]} /></div>
                    <div><label className={labelStyle}>Location</label><input type="text" name="location" value={newEntry.location} onChange={handleChange} className={inputBaseStyle} placeholder="e.g. Mumbai, India" /></div>
                    <div className="md:col-span-2"><label className={labelStyle}>Result / Achievement <span className="text-red-500">*</span></label><select name="result" value={newEntry.result} onChange={handleChange} className={inputBaseStyle}><option value="">Select Result</option><option value="Winner">Winner (Gold)</option><option value="Runner Up">Runner Up (Silver)</option><option value="Semi-Finalist">Semi-Finalist</option><option value="Quarter-Finalist">Quarter-Finalist</option><option value="Participant">Participant</option></select></div>
                </div>

                {error && <div className="text-red-400 text-xs flex items-center gap-2 mb-4 bg-red-900/20 p-2 rounded"><AlertCircle size={14}/> {error}</div>}

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded text-gray-400 hover:text-white text-sm">Cancel</button>
                    <button type="button" onClick={handleSave} className="bg-lime-500 text-black px-6 py-2 rounded font-bold text-sm hover:brightness-110">Save Entry</button>
                </div>
            </div>
        )}

        {/* --- LIST OF ENTRIES --- */}
        <div className="space-y-3">
            {participations.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-[#151515] rounded-lg border border-dashed border-gray-800 text-gray-500">
                    <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                    <p>No tournaments added yet.</p>
                    <button onClick={() => setIsAdding(true)} className="text-lime-500 text-sm mt-2 hover:underline">Add your first tournament</button>
                </div>
            )}

            {participations.map((p) => (
                <div key={p.id} className="bg-[#151515] p-4 rounded-lg border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-700 transition-colors group">
                    <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 
                            ${p.result === 'Winner' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                              p.result === 'Runner Up' ? 'bg-gray-400/20 text-gray-300 border border-gray-400/30' : 
                              'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                            <Trophy size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-base leading-tight">{p.tournamentName}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Award size={12} className="text-lime-500"/> {p.result}</span>
                                <span className="flex items-center gap-1"><MapPin size={12}/> {p.location || "N/A"}</span>
                                <span className="flex items-center gap-1"><Calendar size={12}/> {p.date}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 md:ml-auto">
                        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-[10px] font-bold uppercase border border-gray-700">{p.level}</span>
                        <button type="button" onClick={() => onRemove(p.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-900/10"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
        </div>

        {/* --- ACTION BUTTONS --- */}
        <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800 items-center">
           <button type="button" onClick={onPreview} className="px-6 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide text-sm">Preview</button>
           
           <div className="flex gap-3">
                <button type="button" onClick={onPrevious} className="px-6 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-wide flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> Previous
                </button>
                
                {/* Disabled if currently adding to force save/cancel */}
                <button 
                    type="button" 
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`px-8 py-2.5 rounded-md font-bold uppercase tracking-wide flex items-center gap-2 transition-all text-sm
                        ${!canProceed 
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600" 
                            : "bg-gradient-to-r from-lime-600 to-lime-500 text-black hover:brightness-110"}`
                    }
                >
                    Next <ArrowRight size={16} />
                </button>
           </div>
        </div>
    </div>
  );
};

export default ParticipationTab;