import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, Trash2, Trophy, Star, Calendar, AlertCircle, Medal, FileText, Upload, Eye, Edit2 } from "lucide-react";
import { AchievementRecord } from "../CreateProfile";

// --- STYLES ---
const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";

interface Props {
  achievements: AchievementRecord[];
  onAdd: (record: AchievementRecord) => void;
  onRemove: (id: string) => void;
  onPreview: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AchievementsTab: React.FC<Props> = ({ achievements, onAdd, onRemove, onPreview, onNext, onPrevious }) => {
  
  const [newEntry, setNewEntry] = useState<AchievementRecord>({
      id: "", title: "", organization: "", date: "", description: "", certificateUrl: null, certificateName: null
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sortedAchievements = [...achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewEntry(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setNewEntry(prev => ({ ...prev, certificateUrl: URL.createObjectURL(file), certificateName: file.name }));
      }
  };

  const handleEdit = (record: AchievementRecord) => {
      setNewEntry(record);
      setEditingId(record.id);
      setIsAdding(true);
      // Remove old record immediately to avoid duplication on save? 
      // Better: Keep it until save. But for this simple implementation, we remove it here so it feels like "editing in place".
      onRemove(record.id);
  };

  const handleSave = () => {
      if (!newEntry.title.trim() || !newEntry.organization.trim() || !newEntry.date) {
          setError("Title, Organization, and Date are required.");
          return;
      }
      const idToUse = editingId || Date.now().toString();
      onAdd({ ...newEntry, id: idToUse });
      
      setNewEntry({ id: "", title: "", organization: "", date: "", description: "", certificateUrl: null, certificateName: null });
      setIsAdding(false);
      setEditingId(null);
      setError(null);
  };

  const handleCancel = () => {
      // If we were editing, put the record back
      if (editingId) onAdd(newEntry);
      
      setNewEntry({ id: "", title: "", organization: "", date: "", description: "", certificateUrl: null, certificateName: null });
      setIsAdding(false);
      setEditingId(null);
      setError(null);
  };

  const canProceed = !isAdding;

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
        <div className="flex justify-between items-end border-b border-gray-800 pb-4">
            <div><h3 className="text-white font-bold text-lg uppercase">Notable Achievements</h3><p className="text-gray-400 text-xs mt-1">Awards, recognitions, and special honors.</p></div>
            {!isAdding && (
                <button type="button" onClick={() => setIsAdding(true)} className="bg-lime-500/10 text-lime-500 border border-lime-500/50 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-lime-500 hover:text-black transition-all">
                    <Plus size={16} /> Add Achievement
                </button>
            )}
        </div>

        {isAdding && (
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-lime-500/30 shadow-lg animate-in slide-in-from-top-2">
                <h4 className="text-lime-500 font-bold uppercase text-xs mb-4 tracking-wider flex items-center gap-2"><Star size={14} /> {editingId ? "Edit Achievement" : "New Achievement"}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div><label className={labelStyle}>Award / Title <span className="text-red-500">*</span></label><input type="text" name="title" value={newEntry.title} onChange={handleChange} className={inputBaseStyle} placeholder="e.g. Player of the Year" /></div>
                    <div><label className={labelStyle}>Date Received <span className="text-red-500">*</span></label><input type="date" name="date" value={newEntry.date} onChange={handleChange} className={`${inputBaseStyle} [color-scheme:dark]`} max={new Date().toISOString().split("T")[0]} /></div>
                    <div className="md:col-span-2"><label className={labelStyle}>Issuing Organization <span className="text-red-500">*</span></label><input type="text" name="organization" value={newEntry.organization} onChange={handleChange} className={inputBaseStyle} placeholder="e.g. State Cricket Association" /></div>
                    <div className="md:col-span-2"><label className={labelStyle}>Description (Optional)</label><textarea name="description" value={newEntry.description} onChange={handleChange} className={`${inputBaseStyle} resize-none h-20`} placeholder="Briefly explain the significance of this award..." /></div>
                    <div className="md:col-span-2"><label className={labelStyle}>Certificate (Optional)</label><div className="flex gap-2"><label className="flex-1 flex items-center justify-between bg-[#2C2C2C] rounded-md px-4 py-3 border border-dashed border-gray-600 hover:border-lime-500/50 cursor-pointer transition-colors group"><div className="flex items-center gap-3"><div className="bg-gray-800 p-2 rounded text-gray-400 group-hover:text-lime-500 transition-colors"><Upload size={16} /></div><div className="flex flex-col"><span className="text-sm text-gray-300 font-medium truncate max-w-[200px]">{newEntry.certificateName || "Upload Certificate"}</span><span className="text-[10px] text-gray-500">Supported: PDF, JPG, PNG</span></div></div><input type="file" className="hidden" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} /></label>{newEntry.certificateUrl && (<a href={newEntry.certificateUrl} target="_blank" rel="noreferrer" className="bg-[#2C2C2C] border border-gray-600 text-lime-500 w-12 rounded-md flex items-center justify-center hover:bg-gray-800 hover:border-lime-500 transition-all" title="Preview Certificate"><Eye size={20} /></a>)}</div></div>
                </div>
                {error && <div className="text-red-400 text-xs flex items-center gap-2 mb-4 bg-red-900/20 p-2 rounded"><AlertCircle size={14}/> {error}</div>}
                <div className="flex justify-end gap-3"><button type="button" onClick={handleCancel} className="px-4 py-2 rounded text-gray-400 hover:text-white text-sm">Cancel</button><button type="button" onClick={handleSave} className="bg-lime-500 text-black px-6 py-2 rounded font-bold text-sm hover:brightness-110">{editingId ? "Update" : "Save"} Achievement</button></div>
            </div>
        )}

        <div className="grid grid-cols-1 gap-4">
            {sortedAchievements.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-[#151515] rounded-lg border border-dashed border-gray-800 text-gray-500"><Medal size={48} className="mx-auto mb-3 opacity-20" /><p>No achievements listed yet.</p><button onClick={() => setIsAdding(true)} className="text-lime-500 text-sm mt-2 hover:underline">Add an award</button></div>
            )}
            {sortedAchievements.map((a) => (
                <div key={a.id} className="bg-[#151515] p-5 rounded-lg border border-gray-800 flex items-start justify-between gap-4 hover:border-gray-600 transition-colors group relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-lime-500/50 group-hover:bg-lime-500 transition-colors"></div>
                    <div className="flex items-start gap-4 w-full min-w-0">
                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 text-yellow-500 flex items-center justify-center shrink-0 border border-yellow-500/20"><Trophy size={18} /></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start"><h4 className="text-white font-bold text-base truncate pr-2">{a.title}</h4><span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono bg-gray-900 px-2 py-1 rounded border border-gray-800 shrink-0"><Calendar size={10} /> {a.date}</span></div>
                            <p className="text-lime-500 text-xs font-medium mb-1 truncate">{a.organization}</p>
                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{a.description || "No description provided."}</p>
                            {a.certificateName && (<div className="mt-3 flex items-center gap-2 text-xs text-blue-400 bg-blue-900/10 px-2 py-1 rounded w-fit border border-blue-900/30"><FileText size={12} /> Certificate Attached</div>)}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        <button type="button" onClick={() => handleEdit(a)} className="text-gray-500 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"><Edit2 size={16} /></button>
                        <button type="button" onClick={() => onRemove(a.id)} className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded hover:bg-red-900/10"><Trash2 size={16} /></button>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800 items-center">
           <button type="button" onClick={onPreview} className="px-6 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide text-sm">Preview</button>
           <div className="flex gap-3"><button type="button" onClick={onPrevious} className="px-6 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-wide flex items-center gap-2 text-sm"><ArrowLeft size={16} /> Previous</button><button type="button" onClick={onNext} disabled={!canProceed} className={`px-8 py-2.5 rounded-md font-bold uppercase tracking-wide flex items-center gap-2 transition-all text-sm ${!canProceed ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600" : "bg-gradient-to-r from-lime-600 to-lime-500 text-black hover:brightness-110"}`}>Next <ArrowRight size={16} /></button></div>
        </div>
    </div>
  );
};

export default AchievementsTab;