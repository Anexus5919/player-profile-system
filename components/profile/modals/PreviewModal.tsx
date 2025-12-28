import React, { useState } from "react";
import { X, Activity, Mail, Phone, ImageIcon, Quote, ThumbsUp, ThumbsDown, Linkedin, Facebook, Twitter, Instagram, Trophy, Calendar, MapPin, Medal, Award, Ribbon, Star, ExternalLink, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { FormData, Units, AchievementRecord } from "../CreateProfile";

// --- CUSTOM INTERACTIVE SVG PIE CHART ---
const PieChart = ({ wins, loss, draws }: { wins: number, loss: number, draws: number }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipData, setTooltipData] = useState<{ label: string; value: number; percent: string; color: string } | null>(null);
  
  const total = wins + loss + draws;
  if (total === 0) return <div className="w-64 h-64 rounded-full border-4 border-gray-800 flex items-center justify-center text-xs text-gray-600 bg-[#0a0a0a]">No Data</div>;

  let cumPercent = 0;
  
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = [
    { label: "Wins", value: wins, color: "#84cc16" }, 
    { label: "Loss", value: loss, color: "#ef4444" }, 
    { label: "Draws", value: draws, color: "#eab308" }, 
  ].filter(s => s.value > 0);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg viewBox="-1.2 -1.2 2.4 2.4" className="transform -rotate-90 w-full h-full drop-shadow-2xl">
        {slices.map((slice, i) => {
          const start = getCoordinatesForPercent(cumPercent);
          const slicePercent = slice.value / total;
          cumPercent += slicePercent;
          const end = getCoordinatesForPercent(cumPercent);
          const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
          const pathData = `M 0 0 L ${start[0]} ${start[1]} A 1 1 0 ${largeArcFlag} 1 ${end[0]} ${end[1]} L 0 0`;
          const isHovered = hoveredIndex === i;
          return (
            <path key={i} d={pathData} fill={slice.color} stroke="#121212" strokeWidth="0.02" className={`cursor-pointer transition-all duration-200 ${isHovered ? 'brightness-125' : 'hover:brightness-110'} `} style={{ opacity: hoveredIndex !== null && !isHovered ? 0.7 : 1 }} onMouseEnter={() => { setHoveredIndex(i); setTooltipData({ label: slice.label, value: slice.value, percent: (slicePercent * 100).toFixed(1), color: slice.color }); }} onMouseLeave={() => { setHoveredIndex(null); setTooltipData(null); }} />
          );
        })}
        <circle cx="0" cy="0" r="0.6" fill="#121212" />
      </svg>
      {tooltipData && (
          <div className="absolute top-0 -right-16 z-20 bg-[#1a1a1a] p-3 rounded-lg border border-gray-700 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 min-w-[100px]">
              <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: tooltipData.color }}></div><span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{tooltipData.label}</span></div>
              <div className="flex items-baseline gap-1"><span className="text-xl font-black text-white">{tooltipData.value}</span><span className="text-xs text-gray-500">matches</span></div>
              <div className="mt-1 pt-1 border-t border-gray-800"><span className="text-xs font-bold" style={{ color: tooltipData.color }}>{tooltipData.percent}%</span></div>
          </div>
      )}
    </div>
  );
};

// --- SINGLE ACHIEVEMENT ITEM COMPONENT ---
// Uses props for expand state to allow parent to control "Accordion" behavior
const AchievementItem = ({ 
    achievement, 
    index, 
    isExpanded, 
    onToggle 
}: { 
    achievement: AchievementRecord; 
    index: number; 
    isExpanded: boolean; 
    onToggle: () => void; 
}) => {
    
    // Uniform Premium Styling for ALL cards
    const theme = {
        bg: "bg-gradient-to-br from-[#1a1a1a] to-[#121212]",
        border: isExpanded ? "border-yellow-500/50" : "border-gray-800",
        iconBox: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        title: isExpanded ? "text-yellow-500" : "text-white"
    };

    return (
        <div 
            onClick={onToggle}
            className={`
                relative rounded-xl border transition-all duration-300 cursor-pointer group overflow-hidden
                ${theme.bg} ${theme.border} ${isExpanded ? 'shadow-lg shadow-black/50' : 'hover:border-gray-600'}
            `}
        >
            {/* Left Accent Bar */}
            <div className={`absolute top-0 left-0 h-full w-1 transition-colors ${isExpanded ? 'bg-yellow-500' : 'bg-transparent group-hover:bg-gray-700'}`} />

            {/* Latest Badge */}
            {index === 0 && (
                <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-500 text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest border-l border-b border-yellow-500/20">
                    Latest
                </div>
            )}

            <div className="p-5 flex items-start gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl shrink-0 border ${theme.iconBox}`}>
                    <Trophy size={22} strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className={`font-bold text-base leading-tight pr-8 transition-colors ${theme.title}`}>
                            {achievement.title}
                        </h4>
                        {/* Chevron */}
                        <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-yellow-500' : 'text-gray-600'}`}>
                            <ChevronDown size={18} />
                        </div>
                    </div>
                    
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mt-1 truncate">
                        {achievement.organization}
                    </p>

                    {/* Content Area */}
                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-50 mt-0'}`}>
                        <div className="overflow-hidden">
                            {/* Scrollable Description */}
                            <div className="text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto pr-2 custom-scrollbar border-l-2 border-gray-800 pl-3">
                                {achievement.description || "No detailed description provided."}
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-800/50">
                                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                    <Calendar size={12} className="text-yellow-500" /> {achievement.date}
                                </div>
                                {achievement.certificateUrl && (
                                    <a 
                                        href={achievement.certificateUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()} 
                                        className="flex items-center gap-2 text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 px-3 py-1.5 rounded-md hover:bg-yellow-500 hover:text-black transition-all"
                                    >
                                        <ExternalLink size={14}/> View Certificate
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Collapsed Hints */}
                    {!isExpanded && (
                        <div className="mt-2 text-xs text-gray-600 truncate flex items-center gap-2">
                            <span><Calendar size={10} className="inline mb-0.5"/> {achievement.date}</span>
                            {achievement.certificateUrl && <span className="flex items-center gap-1"><FileText size={10}/> Cert Available</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MAIN PREVIEW COMPONENT ---
interface Props {
  isOpen: boolean; onClose: () => void;
  data: FormData; bmiData: any; image: string | null; units: Units; activeTab: string;
}

const PreviewModal: React.FC<Props> = ({ isOpen, onClose, data, bmiData, image, units, activeTab }) => {
  if (!isOpen) return null;

  const [selectedSport, setSelectedSport] = useState(data.sports.length > 0 ? data.sports[0] : "");
  // Accordion state for Achievements
  const [expandedAchievementId, setExpandedAchievementId] = useState<string | null>(null);

  const calculateAge = (dob: string) => { if (!dob) return "N/A"; return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970); };
  
  const getTitle = () => {
      switch(activeTab) {
          case "PARTICIPATION": return "Career Timeline";
          case "ACHIEVEMENTS": return "Trophy Cabinet";
          case "BIO": return "Scout Report";
          default: return "Player Card";
      }
  }

  // --- Helpers ---
  const getSportSpecificStats = (sport: string) => {
      const stats = data.sportStats[sport] || {};
      if(sport === 'Cricket') return [ { label: "Runs", value: stats.runsScored }, { label: "Wickets", value: stats.wicketsTaken } ];
      if(sport === 'Football') return [ { label: "Goals", value: stats.goalsScored }, { label: "Assists", value: stats.assists } ];
      return [ { label: "Aces", value: stats.aces }, { label: "Smash W.", value: stats.smashWinners } ];
  };

  const getResultIcon = (result: string) => {
      switch (result) {
          case 'Winner': return <Trophy size={14} className="text-yellow-500" />;
          case 'Runner Up': return <Medal size={14} className="text-gray-300" />;
          case 'Semi-Finalist': return <Medal size={14} className="text-orange-400" />;
          case 'Quarter-Finalist': return <Award size={14} className="text-blue-400" />;
          default: return <Ribbon size={14} className="text-gray-500" />;
      }
  };

  const sortedParticipations = [...data.participations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const sortedAchievements = [...data.achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentStats = data.sportStats[selectedSport] || {};
  const extraStats = getSportSpecificStats(selectedSport);

  // Toggle Logic for Accordion
  const toggleAchievement = (id: string) => {
      setExpandedAchievementId(prev => prev === id ? null : id);
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-2 px-2"><h3 className="text-white/50 text-sm font-medium uppercase tracking-widest">Preview: {getTitle()}</h3><button onClick={onClose} className="text-white hover:text-lime-500 transition-colors"><X size={28} /></button></div>

        <div className="bg-[#121212] rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative group min-h-[450px] max-h-[85vh] overflow-y-auto custom-scrollbar">
           <div className="h-2 w-full bg-gradient-to-r from-lime-600 via-lime-400 to-lime-600 sticky top-0 z-20"></div>
           <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] pointer-events-none rotate-12"><img src="/logo.svg" className="w-96 h-96" /></div>

           {activeTab === "ACHIEVEMENTS" ? (
               // --- ACHIEVEMENTS PREVIEW (Accordion Stack) ---
               <div className="p-8 relative z-10">
                   <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                           <div className="bg-yellow-500/10 p-3 rounded-full text-yellow-500"><Trophy size={24} /></div>
                           <div><h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Hall of Fame</h2><p className="text-xs text-gray-500 font-medium">Total Awards: {sortedAchievements.length}</p></div>
                       </div>
                   </div>
                   
                   {sortedAchievements.length > 0 ? (
                       <div className="flex flex-col gap-3">
                           {sortedAchievements.map((a, i) => (
                               <AchievementItem 
                                   key={a.id} 
                                   achievement={a} 
                                   index={i} 
                                   isExpanded={expandedAchievementId === a.id}
                                   onToggle={() => toggleAchievement(a.id)}
                               />
                           ))}
                       </div>
                   ) : <div className="text-center text-gray-500 py-12">No achievements listed yet.</div>}
               </div>
           ) : activeTab === "PARTICIPATION" ? (
               // --- PARTICIPATION PREVIEW ---
               <div className="p-8 relative z-10">
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-8 text-center">Tournament History</h2>
                   {sortedParticipations.length > 0 ? (
                       <div className="relative border-l-2 border-gray-800 ml-4 space-y-8">
                           {sortedParticipations.map((p, i) => (
                               <div key={i} className="relative pl-8">
                                   <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${p.result === 'Winner' ? 'bg-yellow-500 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : p.result === 'Runner Up' ? 'bg-gray-400 border-gray-400' : 'bg-[#121212] border-gray-600'}`}></div>
                                   <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                                       <div className="flex justify-between items-start mb-2"><h4 className="text-white font-bold text-lg">{p.tournamentName}</h4><span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border flex items-center gap-1 ${p.result === 'Winner' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : p.result === 'Runner Up' ? 'bg-gray-400/10 text-gray-300 border-gray-400/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{getResultIcon(p.result)} {p.result}</span></div>
                                       <div className="flex gap-4 text-xs text-gray-400"><span className="flex items-center gap-1"><Calendar size={12}/> {p.date}</span><span className="flex items-center gap-1"><MapPin size={12}/> {p.location || "N/A"}</span></div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : <div className="text-center text-gray-500 py-12">No tournaments added yet.</div>}
               </div>
           ) : activeTab === "BIO" ? (
               // --- BIO PREVIEW ---
               <div className="p-8 relative z-10 flex flex-col h-full">
                   <div className="flex items-center gap-6 mb-8 border-b border-gray-800 pb-6">
                        <div className="w-24 h-24 rounded-full border-4 border-lime-500/20 overflow-hidden shrink-0 shadow-lg">{image ? <img src={image} className="w-full h-full object-cover" /> : <div className="bg-gray-800 w-full h-full flex items-center justify-center"><ImageIcon size={32} className="text-gray-500"/></div>}</div>
                        <div><h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{data.fullName || "PLAYER NAME"}</h2><div className="flex flex-wrap gap-2 text-sm"><span className="text-lime-500 font-bold bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">{data.nationality || "Nationality"}</span>{data.sports.map(s => <span key={s} className="text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">{s}</span>)}</div></div>
                   </div>
                   <div className="mb-8 relative pl-6 border-l-4 border-lime-500"><Quote className="absolute top-[-10px] left-[-40px] text-gray-800 fill-current" size={40} /><p className="text-gray-300 italic text-lg leading-relaxed">{data.bio || "No bio provided yet."}</p></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                       <div className="bg-lime-900/10 p-5 rounded-xl border border-lime-500/20"><div className="flex items-center gap-2 mb-4 text-lime-500 font-bold uppercase tracking-wider text-sm"><ThumbsUp size={16} /> Strengths</div><div className="flex flex-wrap gap-2 mb-4">{data.strengths.length > 0 ? data.strengths.map(s => <span key={s} className="bg-lime-500/20 text-lime-400 px-2 py-1 rounded text-xs">{s}</span>) : <span className="text-gray-600 text-xs">None added</span>}</div><p className="text-xs text-gray-400 leading-relaxed border-t border-lime-500/20 pt-3">{data.strengthDescription}</p></div>
                       <div className="bg-red-900/10 p-5 rounded-xl border border-red-500/20"><div className="flex items-center gap-2 mb-4 text-red-500 font-bold uppercase tracking-wider text-sm"><ThumbsDown size={16} /> Areas to Improve</div><div className="flex flex-wrap gap-2 mb-4">{data.weaknesses.length > 0 ? data.weaknesses.map(w => <span key={w} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">{w}</span>) : <span className="text-gray-600 text-xs">None added</span>}</div><p className="text-xs text-gray-400 leading-relaxed border-t border-red-500/20 pt-3">{data.weaknessDescription}</p></div>
                   </div>
                   <div className="flex gap-4 justify-center border-t border-gray-800 pt-6">{data.socialLinks.facebook && <a href={data.socialLinks.facebook} className="text-blue-500 hover:scale-110"><Facebook size={20} /></a>}{data.socialLinks.instagram && <a href={data.socialLinks.instagram} className="text-pink-500 hover:scale-110"><Instagram size={20} /></a>}{data.socialLinks.twitter && <a href={data.socialLinks.twitter} className="text-blue-400 hover:scale-110"><Twitter size={20} /></a>}</div>
               </div>
           ) : activeTab === "SPORTS STATS" ? (
             /* --- SPORTS STATS PREVIEW --- */
             <div className="p-8 flex flex-col items-center justify-center relative z-10 h-full">
                {data.sports.length > 0 ? (
                    <>
                        <div className="mb-8 w-full max-w-xs relative"><label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest absolute -top-4 left-0">Select Sport View</label><select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="w-full bg-[#1a1a1a] text-white text-lg font-bold px-4 py-2 rounded-md border border-gray-700 focus:border-lime-500 outline-none appearance-none">{data.sports.map(s => <option key={s} value={s}>{s}</option>)}</select><div className="absolute right-3 top-3 pointer-events-none text-lime-500">▼</div></div>
                        <div className="flex flex-col md:flex-row items-center gap-16 w-full justify-center"><div className="flex flex-col items-center"><PieChart wins={parseInt(currentStats.wins)||0} loss={parseInt(currentStats.loss)||0} draws={parseInt(currentStats.draws)||0} /></div><div className="grid grid-cols-2 gap-4 w-full max-w-md"><div className="bg-[#1a1a1a] p-4 rounded border border-gray-800 text-center"><span className="block text-xs text-gray-500 uppercase mb-1">Matches</span><span className="text-2xl font-bold text-white">{currentStats.matchesPlayed||"0"}</span></div><div className="bg-[#1a1a1a] p-4 rounded border border-gray-800 text-center"><span className="block text-xs text-gray-500 uppercase mb-1">Win Rate</span><span className="text-2xl font-bold text-lime-500">{currentStats.matchesPlayed?Math.round((parseInt(currentStats.wins||"0")/parseInt(currentStats.matchesPlayed))*100)+"%":"0%"}</span></div>{extraStats.map(stat=><div key={stat.label} className="bg-[#1a1a1a] p-4 rounded border border-gray-800 text-center"><span className="block text-xs text-gray-500 uppercase mb-1">{stat.label}</span><span className="text-xl font-bold text-white">{stat.value||"0"}</span></div>)}</div></div>
                    </>
                ) : <p className="text-gray-500">No sports selected.</p>}
             </div>
           ) : (
             /* --- PERSONAL INFO PREVIEW --- */
             <div className="p-8 flex flex-col md:flex-row gap-8 relative z-10">
                <div className="flex-shrink-0 flex flex-col items-center gap-4">
                   <div className="w-48 h-56 rounded-xl bg-gray-800 border-2 border-lime-500/30 overflow-hidden shadow-lg relative"><div className="absolute bottom-0 left-0 w-full bg-black/90 backdrop-blur-sm py-2 text-center border-t border-lime-500/30"><span className="text-lime-500 font-bold uppercase tracking-wider text-xs block truncate px-2">{data.sports.length>1?`${data.sports[0]} +${data.sports.length-1} More`:data.sports[0]||"ATHLETE"}</span></div>{image?<img src={image} className="w-full h-full object-cover"/>:<div className="w-full h-full flex flex-col items-center justify-center text-gray-600"><ImageIcon size={32}/></div>}</div>
                   <div className="flex flex-col items-center gap-1 opacity-50"><span className="text-[10px] tracking-[0.2em] text-gray-400">ID: {Date.now().toString().slice(-8)}</span></div>
                </div>
                <div className="flex-1 w-full"><div className="border-b border-gray-800 pb-4 mb-6"><h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{data.fullName||"PLAYER NAME"}</h2><div className="flex flex-wrap items-center gap-2 mt-3"><span className="bg-lime-500/10 text-lime-500 px-3 py-1 rounded text-xs font-bold uppercase border border-lime-500/20">{data.nationality||"Unknown"}</span>{data.sports.map(s=><span key={s} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700 flex items-center gap-1">{s}</span>)}</div><div className="mt-2 text-gray-500 text-xs uppercase tracking-wider font-medium">• {data.gender||"N/A"} • {calculateAge(data.dob)} Years Old</div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"><div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800"><span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Height</span><span className="text-xl font-bold text-white">{data.height||"-"} <span className="text-xs text-gray-600">{units.height}</span></span></div><div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800"><span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Weight</span><span className="text-xl font-bold text-white">{data.weight||"-"} <span className="text-xs text-gray-600">{units.weight}</span></span></div><div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 md:col-span-2 relative overflow-hidden"><div className={`absolute right-0 top-0 h-full w-1 ${bmiData.color.replace('text-','bg-')}`}></div><span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">BMI Index</span><div className="flex items-baseline gap-2"><span className={`text-xl font-bold ${bmiData.color}`}>{bmiData.value||"--"}</span><span className="text-xs text-gray-400">({bmiData.status})</span></div></div></div><div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 mb-4"><div className="flex items-center gap-3"><Activity size={18} className="text-lime-500"/><span className="text-sm font-medium text-gray-300">Agility Rating</span></div><div className="flex gap-1">{[1,2,3,4,5].map(star=><div key={star} className={`h-2 w-6 rounded-full ${star<=parseInt(data.agilityRating||'0')?'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]':'bg-gray-700'}`}></div>)}</div></div><div className="col-span-2 flex flex-wrap gap-4 text-xs text-gray-400"><span className="flex items-center gap-1.5"><Mail size={12} className="text-lime-500"/> {data.email||"No Email"}</span><span className="flex items-center gap-1.5"><Phone size={12} className="text-lime-500"/> {data.contactNo||"No Phone"}</span></div></div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;