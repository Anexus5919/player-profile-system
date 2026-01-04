"use client";

import React, { useState } from "react";
import {
    User, Activity, FileText, Trophy, Medal, Award, Ribbon, Star,
    Calendar, MapPin, Quote, ThumbsUp, ThumbsDown, Linkedin, Facebook,
    Twitter, Instagram, Mail, Phone, Image as ImageIcon, ChevronDown,
    ExternalLink, Crown, Play, Film, ArrowLeft, Share2, Globe, X, Link, Video
} from "lucide-react";
import { FormData, Units, AchievementRecord, MediaItem, ParticipationRecord } from "./CreateProfile";

// --- CUSTOM INTERACTIVE SVG PIE CHART (Reused from PreviewModal) ---
const PieChart = ({ wins, loss, draws }: { wins: number, loss: number, draws: number }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [tooltipData, setTooltipData] = useState<{ label: string; value: number; percent: string; color: string } | null>(null);

    const total = wins + loss + draws;
    if (total === 0) return <div className="w-48 h-48 rounded-full border-4 border-gray-800 flex items-center justify-center text-xs text-gray-600 bg-[#0a0a0a]">No Data</div>;

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
        <div className="relative w-48 h-48 flex items-center justify-center">
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
                        <path key={i} d={pathData} fill={slice.color} stroke="#121212" strokeWidth="0.02" className={`cursor-pointer transition-all duration-200 ${isHovered ? 'brightness-125' : 'hover:brightness-110'}`} style={{ opacity: hoveredIndex !== null && !isHovered ? 0.7 : 1 }} onMouseEnter={() => { setHoveredIndex(i); setTooltipData({ label: slice.label, value: slice.value, percent: (slicePercent * 100).toFixed(1), color: slice.color }); }} onMouseLeave={() => { setHoveredIndex(null); setTooltipData(null); }} />
                    );
                })}
                <circle cx="0" cy="0" r="0.6" fill="#121212" />
            </svg>
            {tooltipData && (
                <div className="absolute top-0 -right-12 z-20 bg-[#1a1a1a] p-2 rounded-lg border border-gray-700 shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 min-w-[80px]">
                    <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: tooltipData.color }}></div><span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{tooltipData.label}</span></div>
                    <div className="flex items-baseline gap-1"><span className="text-lg font-black text-white">{tooltipData.value}</span><span className="text-xs text-gray-500">matches</span></div>
                    <div className="mt-1 pt-1 border-t border-gray-800"><span className="text-xs font-bold" style={{ color: tooltipData.color }}>{tooltipData.percent}%</span></div>
                </div>
            )}
        </div>
    );
};

// --- ACHIEVEMENT ITEM (Reused from PreviewModal) ---
const AchievementItem = ({ achievement, index, isExpanded, onToggle }: { achievement: AchievementRecord; index: number; isExpanded: boolean; onToggle: () => void; }) => {
    const colorPalettes = [
        { main: "text-yellow-500", bgSoft: "bg-yellow-500/10", borderSoft: "border-yellow-500/20", border: "border-yellow-500/50", bar: "bg-yellow-500", hoverText: "hover:text-black", hoverBg: "hover:bg-yellow-500" },
        { main: "text-cyan-400", bgSoft: "bg-cyan-400/10", borderSoft: "border-cyan-400/20", border: "border-cyan-400/50", bar: "bg-cyan-400", hoverText: "hover:text-black", hoverBg: "hover:bg-cyan-400" },
        { main: "text-purple-500", bgSoft: "bg-purple-500/10", borderSoft: "border-purple-500/20", border: "border-purple-500/50", bar: "bg-purple-500", hoverText: "hover:text-white", hoverBg: "hover:bg-purple-500" },
        { main: "text-rose-500", bgSoft: "bg-rose-500/10", borderSoft: "border-rose-500/20", border: "border-rose-500/50", bar: "bg-rose-500", hoverText: "hover:text-white", hoverBg: "hover:bg-rose-500" },
        { main: "text-emerald-400", bgSoft: "bg-emerald-400/10", borderSoft: "border-emerald-400/20", border: "border-emerald-400/50", bar: "bg-emerald-400", hoverText: "hover:text-black", hoverBg: "hover:bg-emerald-400" },
        { main: "text-orange-500", bgSoft: "bg-orange-500/10", borderSoft: "border-orange-500/20", border: "border-orange-500/50", bar: "bg-orange-500", hoverText: "hover:text-black", hoverBg: "hover:bg-orange-500" }
    ];
    const activeColor = colorPalettes[index % colorPalettes.length];
    const theme = { bg: "bg-gradient-to-br from-[#1a1a1a] to-[#121212]", border: isExpanded ? activeColor.border : "border-gray-800", iconBox: `${activeColor.bgSoft} ${activeColor.main} ${activeColor.borderSoft}`, title: isExpanded ? activeColor.main : "text-white" };

    return (
        <div onClick={onToggle} className={`relative rounded-xl border transition-all duration-300 cursor-pointer group overflow-hidden ${theme.bg} ${theme.border} ${isExpanded ? 'shadow-lg shadow-black/50' : 'hover:border-gray-600'}`}>
            <div className={`absolute top-0 left-0 h-full w-1 transition-colors ${isExpanded ? activeColor.bar : 'bg-transparent group-hover:bg-gray-700'}`} />
            {index === 0 && (<div className={`absolute top-0 right-0 ${activeColor.bgSoft} ${activeColor.main} text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest border-l border-b ${activeColor.borderSoft}`}>Latest</div>)}
            <div className="p-4 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 border ${theme.iconBox}`}><Trophy size={18} strokeWidth={1.5} /></div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className={`font-bold text-sm leading-tight pr-6 transition-colors ${theme.title}`}>{achievement.title}</h4>
                        <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? `rotate-180 ${activeColor.main}` : 'text-gray-600'}`}><ChevronDown size={16} /></div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wide mt-1 truncate">{achievement.organization}</p>
                    {isExpanded && (
                        <div className="mt-3 space-y-2">
                            <p className="text-xs text-gray-300 leading-relaxed">{achievement.description || "No description."}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Calendar size={10} className={activeColor.main} /> {achievement.date}
                            </div>
                            {achievement.certificateUrl && (
                                <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`inline-flex items-center gap-1 text-xs font-bold ${activeColor.bgSoft} ${activeColor.main} border ${activeColor.border} px-2 py-1 rounded-md ${activeColor.hoverBg} ${activeColor.hoverText} transition-all`}>
                                    <ExternalLink size={12} /> View Certificate
                                </a>
                            )}
                        </div>
                    )}
                    {!isExpanded && (<div className="mt-1 text-xs text-gray-600 truncate"><Calendar size={10} className="inline mb-0.5" /> {achievement.date}</div>)}
                </div>
            </div>
        </div>
    );
};

// --- SECTION WRAPPER ---
const SectionWrapper = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="mb-8">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-lime-500/10 border border-lime-500/30 flex items-center justify-center">
                <Icon size={20} className="text-lime-500" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wide">{title}</h2>
        </div>
        <div className="bg-[#121212] rounded-2xl overflow-hidden border border-gray-800">
            {children}
        </div>
    </div>
);

// --- MEDIA ITEM DISPLAY (Interactive) ---
const MediaDisplay = ({
    items,
    onImageClick
}: {
    items: MediaItem[];
    onImageClick: (url: string, caption?: string) => void;
}) => {
    if (!items || items.length === 0) return <p className="text-gray-500 text-sm text-center py-4">No media added.</p>;

    const images = items.filter(m => m.type === 'image');
    const videos = items.filter(m => m.type === 'video');
    const links = items.filter(m => m.type === 'link' || m.type === 'certificate');

    const handleVideoClick = (url: string) => {
        window.open(url, '_blank');
    };

    const handleLinkClick = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {images.map(img => (
                <div
                    key={img.id}
                    className="aspect-video rounded-lg overflow-hidden border border-gray-800 cursor-pointer hover:border-lime-500/50 transition-all hover:scale-[1.02] group"
                    onClick={() => onImageClick(img.url, img.caption)}
                >
                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
            ))}
            {videos.map(vid => (
                <div
                    key={vid.id}
                    className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] flex items-center justify-center relative cursor-pointer hover:border-red-500/50 transition-colors group"
                    onClick={() => handleVideoClick(vid.url)}
                >
                    {vid.thumbnail ? <img src={vid.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" /> : null}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={18} className="text-white ml-0.5" fill="white" />
                        </div>
                    </div>
                </div>
            ))}
            {links.map(link => {
                const isPdf = link.url.toLowerCase().includes('.pdf');
                const isDrive = link.url.toLowerCase().includes('drive.google.com');
                return (
                    <div
                        key={link.id}
                        className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer hover:border-blue-500/50 transition-colors group"
                        onClick={() => handleLinkClick(link.url)}
                    >
                        {isPdf ? (
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText size={18} className="text-red-400" />
                            </div>
                        ) : isDrive ? (
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                </svg>
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Globe size={18} className="text-blue-400" />
                            </div>
                        )}
                        <span className="text-[10px] text-gray-400 truncate w-full text-center">{link.caption}</span>
                        <span className={`text-[8px] uppercase font-bold ${isPdf ? 'text-red-400' : isDrive ? 'text-green-400' : 'text-blue-400'}`}>
                            Click to Open
                        </span>
                    </div>
                );
            })}
            {items.length > 12 && (
                <div className="aspect-video rounded-lg border border-gray-800 bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-sm text-gray-400">+{items.length - 12} more</span>
                </div>
            )}
        </div>
    );
};

// --- MAIN PROFILE SUMMARY COMPONENT ---
interface Props {
    data: FormData;
    bmiData: { value: string; status: string; color: string };
    image: string | null;
    units: Units;
    onEdit: () => void;
}

const ProfileSummary: React.FC<Props> = ({ data, bmiData, image, units, onEdit }) => {
    const [expandedAchievementId, setExpandedAchievementId] = useState<string | null>(null);
    const [selectedSport, setSelectedSport] = useState(data.sports.length > 0 ? data.sports[0] : "");
    const [imageModal, setImageModal] = useState<{ isOpen: boolean; url: string; caption?: string }>({ isOpen: false, url: '', caption: '' });
    const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'link' | 'certificate'>('all');

    const handleShare = async () => {
        const shareData = {
            title: `${data.fullName} - Player Profile`,
            text: `Check out ${data.fullName}'s sports profile!`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or error
                navigator.clipboard.writeText(window.location.href);
                alert('Profile link copied to clipboard!');
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Profile link copied to clipboard!');
        }
    };

    const openImageModal = (url: string, caption?: string) => {
        setImageModal({ isOpen: true, url, caption });
    };

    const closeImageModal = () => {
        setImageModal({ isOpen: false, url: '', caption: '' });
    };

    const calculateAge = (dob: string) => { if (!dob) return "N/A"; return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970); };

    const getResultIcon = (result: string) => {
        switch (result) {
            case 'Winner': return <Trophy size={12} className="text-yellow-500" />;
            case 'Runner Up': return <Medal size={12} className="text-gray-300" />;
            case 'Semi-Finalist': return <Medal size={12} className="text-orange-400" />;
            case 'Quarter-Finalist': return <Award size={12} className="text-blue-400" />;
            default: return <Ribbon size={12} className="text-gray-500" />;
        }
    };

    const getSportSpecificStats = (sport: string) => {
        const stats = data.sportStats[sport] || {};
        if (sport === 'Cricket') return [{ label: "Runs", value: stats.runsScored }, { label: "Wickets", value: stats.wicketsTaken }];
        if (sport === 'Football') return [{ label: "Goals", value: stats.goalsScored }, { label: "Assists", value: stats.assists }];
        return [{ label: "Aces", value: stats.aces }, { label: "Smash W.", value: stats.smashWinners }];
    };

    const sortedParticipations = [...data.participations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedAchievements = [...data.achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const currentStats = data.sportStats[selectedSport] || {};
    const extraStats = getSportSpecificStats(selectedSport);

    return (
        <div className="min-h-screen bg-black text-gray-300">
            {/* Header */}
            <div className="bg-gradient-to-b from-[#1a1a1a] to-black py-8 border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-black text-lime-500 uppercase tracking-tight mb-2">Profile Summary</h1>
                    <p className="text-gray-400 text-sm">Review your complete profile before submission</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

                {/* PERSONAL INFO - Player Card Style (Unchanged from PreviewModal) */}
                <SectionWrapper title="Personal Info" icon={User}>
                    <div className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0 flex flex-col items-center gap-3">
                            <div className="w-40 h-48 rounded-xl bg-gray-800 border-2 border-lime-500/30 overflow-hidden shadow-lg relative">
                                <div className="absolute bottom-0 left-0 w-full bg-black/90 backdrop-blur-sm py-2 text-center border-t border-lime-500/30">
                                    <span className="text-lime-500 font-bold uppercase tracking-wider text-xs block truncate px-2">
                                        {data.sports.length > 1 ? `${data.sports[0]} +${data.sports.length - 1} More` : data.sports[0] || "ATHLETE"}
                                    </span>
                                </div>
                                {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-600"><ImageIcon size={32} /></div>}
                            </div>
                            <span className="text-[10px] tracking-[0.2em] text-gray-500 opacity-50">ID: {Date.now().toString().slice(-8)}</span>
                        </div>
                        <div className="flex-1">
                            <div className="border-b border-gray-800 pb-3 mb-4">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{data.fullName || "PLAYER NAME"}</h2>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span className="bg-lime-500/10 text-lime-500 px-2 py-0.5 rounded text-xs font-bold uppercase border border-lime-500/20">{data.nationality || "Unknown"}</span>
                                    {data.sports.map(s => <span key={s} className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs border border-gray-700">{s}</span>)}
                                </div>
                                <div className="mt-1 text-gray-500 text-xs uppercase tracking-wider">• {data.gender || "N/A"} • {calculateAge(data.dob)} Years Old</div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                <div className="bg-[#1a1a1a] p-2 rounded-lg border border-gray-800">
                                    <span className="text-gray-500 text-[10px] uppercase font-bold block mb-0.5">Height</span>
                                    <span className="text-lg font-bold text-white">{data.height || "-"} <span className="text-xs text-gray-600">{units.height}</span></span>
                                </div>
                                <div className="bg-[#1a1a1a] p-2 rounded-lg border border-gray-800">
                                    <span className="text-gray-500 text-[10px] uppercase font-bold block mb-0.5">Weight</span>
                                    <span className="text-lg font-bold text-white">{data.weight || "-"} <span className="text-xs text-gray-600">{units.weight}</span></span>
                                </div>
                                <div className="bg-[#1a1a1a] p-2 rounded-lg border border-gray-800 md:col-span-2 relative overflow-hidden">
                                    <div className={`absolute right-0 top-0 h-full w-1 ${bmiData.color.replace('text-', 'bg-')}`}></div>
                                    <span className="text-gray-500 text-[10px] uppercase font-bold block mb-0.5">BMI Index</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-lg font-bold ${bmiData.color}`}>{bmiData.value || "--"}</span>
                                        <span className="text-xs text-gray-400">({bmiData.status})</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded-lg border border-gray-800 mb-3">
                                <div className="flex items-center gap-2"><Activity size={14} className="text-lime-500" /><span className="text-xs font-medium text-gray-300">Agility Rating</span></div>
                                <div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => <div key={star} className={`h-2 w-5 rounded-full ${star <= parseInt(data.agilityRating || '0') ? 'bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.5)]' : 'bg-gray-700'}`}></div>)}</div>
                            </div>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1"><Mail size={12} className="text-lime-500" /> {data.email || "No Email"}</span>
                                <span className="flex items-center gap-1"><Phone size={12} className="text-lime-500" /> {data.contactNo || "No Phone"}</span>
                            </div>
                        </div>
                    </div>
                </SectionWrapper>

                {/* SPORTS STATS - Pie Chart Style */}
                <SectionWrapper title="Sports Stats" icon={Activity}>
                    <div className="p-6">
                        {data.sports.length > 0 ? (
                            <>
                                {data.sports.length > 1 && (
                                    <div className="mb-6 max-w-xs">
                                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest block mb-1">Select Sport</label>
                                        <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="w-full bg-[#1a1a1a] text-white text-sm font-bold px-3 py-2 rounded-md border border-gray-700 focus:border-lime-500 outline-none">
                                            {data.sports.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                                <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
                                    <PieChart wins={parseInt(currentStats.wins) || 0} loss={parseInt(currentStats.loss) || 0} draws={parseInt(currentStats.draws) || 0} />
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                                        <div className="bg-[#1a1a1a] p-3 rounded border border-gray-800 text-center">
                                            <span className="block text-xs text-gray-500 uppercase mb-1">Matches</span>
                                            <span className="text-xl font-bold text-white">{currentStats.matchesPlayed || "0"}</span>
                                        </div>
                                        <div className="bg-[#1a1a1a] p-3 rounded border border-gray-800 text-center">
                                            <span className="block text-xs text-gray-500 uppercase mb-1">Win Rate</span>
                                            <span className="text-xl font-bold text-lime-500">{currentStats.matchesPlayed ? Math.round((parseInt(currentStats.wins || "0") / parseInt(currentStats.matchesPlayed)) * 100) + "%" : "0%"}</span>
                                        </div>
                                        {extraStats.map(stat => (
                                            <div key={stat.label} className="bg-[#1a1a1a] p-3 rounded border border-gray-800 text-center">
                                                <span className="block text-xs text-gray-500 uppercase mb-1">{stat.label}</span>
                                                <span className="text-lg font-bold text-white">{stat.value || "0"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : <p className="text-gray-500 text-center py-8">No sports selected.</p>}
                    </div>
                </SectionWrapper>

                {/* BIO - Scout Report Style */}
                <SectionWrapper title="Bio" icon={Quote}>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
                            <div className="w-16 h-16 rounded-full border-2 border-lime-500/20 overflow-hidden shrink-0 shadow-lg">
                                {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="bg-gray-800 w-full h-full flex items-center justify-center"><ImageIcon size={24} className="text-gray-500" /></div>}
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase italic">{data.fullName || "PLAYER NAME"}</h3>
                                <div className="flex flex-wrap gap-1 text-xs">
                                    <span className="text-lime-500 font-bold">{data.nationality}</span>
                                    {data.sports.map(s => <span key={s} className="text-gray-400">• {s}</span>)}
                                </div>
                            </div>
                        </div>
                        {data.bio && (
                            <div className="mb-6 relative pl-4 border-l-2 border-lime-500">
                                <p className="text-gray-300 italic leading-relaxed">{data.bio}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-lime-900/10 p-4 rounded-xl border border-lime-500/20">
                                <div className="flex items-center gap-2 mb-3 text-lime-500 font-bold uppercase tracking-wider text-xs"><ThumbsUp size={14} /> Strengths</div>
                                <div className="flex flex-wrap gap-1 mb-3">{data.strengths.length > 0 ? data.strengths.map(s => <span key={s} className="bg-lime-500/20 text-lime-400 px-2 py-0.5 rounded text-xs">{s}</span>) : <span className="text-gray-600 text-xs">None added</span>}</div>
                                {data.strengthDescription && <p className="text-xs text-gray-400 leading-relaxed border-t border-lime-500/20 pt-2">{data.strengthDescription}</p>}
                            </div>
                            <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                                <div className="flex items-center gap-2 mb-3 text-red-500 font-bold uppercase tracking-wider text-xs"><ThumbsDown size={14} /> Areas to Improve</div>
                                <div className="flex flex-wrap gap-1 mb-3">{data.weaknesses.length > 0 ? data.weaknesses.map(w => <span key={w} className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-xs">{w}</span>) : <span className="text-gray-600 text-xs">None added</span>}</div>
                                {data.weaknessDescription && <p className="text-xs text-gray-400 leading-relaxed border-t border-red-500/20 pt-2">{data.weaknessDescription}</p>}
                            </div>
                        </div>
                        {(data.socialLinks.facebook || data.socialLinks.instagram || data.socialLinks.twitter || data.socialLinks.linkedin) && (
                            <div className="flex gap-3 justify-center border-t border-gray-800 pt-4">
                                {data.socialLinks.facebook && <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:scale-110 transition-transform"><Facebook size={18} /></a>}
                                {data.socialLinks.instagram && <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:scale-110 transition-transform"><Instagram size={18} /></a>}
                                {data.socialLinks.twitter && <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:scale-110 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>}
                                {data.socialLinks.linkedin && <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:scale-110 transition-transform"><Linkedin size={18} /></a>}
                            </div>
                        )}
                    </div>
                </SectionWrapper>

                {/* PARTICIPATION - Timeline Style */}
                <SectionWrapper title="Participation History" icon={Calendar}>
                    <div className="p-6">
                        {sortedParticipations.length > 0 ? (
                            <div className="relative border-l-2 border-gray-800 ml-3 space-y-4">
                                {sortedParticipations.map((p, i) => (
                                    <div key={i} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${p.result === 'Winner' ? 'bg-yellow-500 border-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : p.result === 'Runner Up' ? 'bg-gray-400 border-gray-400' : 'bg-[#121212] border-gray-600'}`}></div>
                                        <div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-white font-bold text-sm">{p.tournamentName}</h4>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${p.result === 'Winner' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : p.result === 'Runner Up' ? 'bg-gray-400/10 text-gray-300 border-gray-400/20' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>{getResultIcon(p.result)} {p.result}</span>
                                            </div>
                                            <div className="flex gap-3 text-xs text-gray-400">
                                                <span className="flex items-center gap-1"><Calendar size={10} /> {p.date}</span>
                                                <span className="flex items-center gap-1"><MapPin size={10} /> {p.location || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 text-center py-8">No tournaments added yet.</p>}
                    </div>
                </SectionWrapper>

                {/* ACHIEVEMENTS - Trophy Cabinet Style */}
                <SectionWrapper title="Achievements" icon={Trophy}>
                    <div className="p-6">
                        {sortedAchievements.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gradient-to-r from-[#151515] to-[#0f0f0f] px-4 py-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500"><Crown size={18} strokeWidth={1.8} /></div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase tracking-wide text-white">Hall of Fame</h3>
                                            <p className="text-xs text-gray-500">Total Awards: {sortedAchievements.length}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {sortedAchievements.map((a, i) => (
                                        <AchievementItem key={a.id} achievement={a} index={i} isExpanded={expandedAchievementId === a.id} onToggle={() => setExpandedAchievementId(prev => prev === a.id ? null : a.id)} />
                                    ))}
                                </div>
                            </>
                        ) : <p className="text-gray-500 text-center py-8">No achievements listed yet.</p>}
                    </div>
                </SectionWrapper>

                {/* MEDIA - Gallery Style */}
                <SectionWrapper title="Media & Highlights" icon={Film}>
                    <div className="p-6">
                        {/* My Journey Section */}
                        {data.playerJourney && (
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">My Journey</h4>
                                <div className="relative pl-4 border-l-2 border-lime-500/50">
                                    <p className="text-gray-300 italic text-sm leading-relaxed">{data.playerJourney}</p>
                                </div>
                            </div>
                        )}

                        {/* Media Filter Tabs */}
                        {data.media.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {[
                                        { key: 'all', label: 'All Media', icon: Film },
                                        { key: 'image', label: 'Photos', icon: ImageIcon },
                                        { key: 'video', label: 'Videos', icon: Video },
                                        { key: 'link', label: 'Links', icon: Link },
                                        { key: 'certificate', label: 'Certificates', icon: FileText }
                                    ].map(tab => {
                                        const TabIcon = tab.icon;
                                        const count = tab.key === 'all'
                                            ? data.media.length
                                            : data.media.filter(m => m.type === tab.key).length;
                                        if (count === 0 && tab.key !== 'all') return null;
                                        return (
                                            <button
                                                key={tab.key}
                                                onClick={() => setMediaFilter(tab.key as typeof mediaFilter)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${mediaFilter === tab.key
                                                        ? 'bg-lime-500 text-black'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    }`}
                                            >
                                                <TabIcon size={12} />
                                                {tab.label} ({count})
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Filtered Media Grid */}
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {data.media
                                        .filter(m => mediaFilter === 'all' || m.type === mediaFilter)
                                        .map(item => {
                                            if (item.type === 'image') {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="aspect-video rounded-lg overflow-hidden border border-gray-800 cursor-pointer hover:border-lime-500/50 transition-all hover:scale-[1.02] group"
                                                        onClick={() => openImageModal(item.url, item.caption)}
                                                    >
                                                        <img src={item.url} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={item.caption || ''} />
                                                    </div>
                                                );
                                            }
                                            if (item.type === 'video') {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] flex items-center justify-center relative cursor-pointer hover:border-red-500/50 transition-colors group"
                                                        onClick={() => window.open(item.url, '_blank')}
                                                    >
                                                        {item.thumbnail ? <img src={item.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" /> : null}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="w-10 h-10 rounded-full bg-red-500/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                <Play size={18} className="text-white ml-0.5" fill="white" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            // Links and Certificates
                                            const isPdf = item.url.toLowerCase().includes('.pdf');
                                            const isDrive = item.url.toLowerCase().includes('drive.google.com');
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] flex flex-col items-center justify-center gap-1 p-2 cursor-pointer hover:border-blue-500/50 transition-colors group"
                                                    onClick={() => window.open(item.url, '_blank')}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${isPdf ? 'bg-red-500/20' : isDrive ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                                                        {isPdf ? <FileText size={18} className="text-red-400" /> : isDrive ? <FileText size={18} className="text-green-400" /> : <Globe size={18} className="text-blue-400" />}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 truncate w-full text-center">{item.caption}</span>
                                                    <span className={`text-[8px] uppercase font-bold ${isPdf ? 'text-red-400' : isDrive ? 'text-green-400' : 'text-blue-400'}`}>Click to Open</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Event Highlights with Timeline */}
                        {sortedParticipations.filter(p => p.story || (p.media && p.media.length > 0)).length > 0 && (
                            <div className="mt-6 pt-4 border-t border-gray-800">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">Event Highlights</h4>

                                {/* Timeline Container */}
                                <div className="relative">
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-700"></div>

                                    {/* Timeline Events */}
                                    <div className="space-y-8">
                                        {sortedParticipations.filter(p => p.story || (p.media && p.media.length > 0)).map((p, index) => (
                                            <div key={p.id} className="relative pl-12">
                                                {/* Timeline Dot */}
                                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#121212] border-2 border-gray-600 flex items-center justify-center z-10">
                                                    <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                                                </div>

                                                {/* Event Card */}
                                                <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-4">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h5 className="text-lime-500 font-bold text-sm">{p.tournamentName}</h5>
                                                        <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">{p.date}</span>
                                                    </div>
                                                    {p.story && (
                                                        <div className="mb-4 relative pl-4 border-l-2 border-gray-700">
                                                            <p className="text-gray-400 text-sm leading-relaxed">{p.story}</p>
                                                        </div>
                                                    )}
                                                    {p.media && p.media.length > 0 && (
                                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                                            {p.media.map(item => {
                                                                if (item.type === 'image') {
                                                                    return (
                                                                        <div
                                                                            key={item.id}
                                                                            className="aspect-video rounded-lg overflow-hidden border border-gray-800 cursor-pointer hover:border-lime-500/50 transition-all group"
                                                                            onClick={() => openImageModal(item.url, item.caption)}
                                                                        >
                                                                            <img src={item.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.caption || ''} />
                                                                        </div>
                                                                    );
                                                                }
                                                                if (item.type === 'video') {
                                                                    return (
                                                                        <div
                                                                            key={item.id}
                                                                            className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] relative cursor-pointer hover:border-red-500/50 group"
                                                                            onClick={() => window.open(item.url, '_blank')}
                                                                        >
                                                                            {item.thumbnail && <img src={item.thumbnail} className="w-full h-full object-cover opacity-60" />}
                                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                                <div className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center">
                                                                                    <Play size={14} className="text-white ml-0.5" fill="white" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                                return (
                                                                    <div
                                                                        key={item.id}
                                                                        className="aspect-video rounded-lg overflow-hidden border border-gray-800 bg-[#1a1a1a] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50"
                                                                        onClick={() => window.open(item.url, '_blank')}
                                                                    >
                                                                        <Globe size={16} className="text-blue-400" />
                                                                        <span className="text-[9px] text-gray-500 mt-1">Open Link</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SectionWrapper>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-800">
                    <button onClick={onEdit} className="px-6 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-wide flex items-center gap-2 text-sm">
                        <ArrowLeft size={18} /> Edit Profile
                    </button>
                    <button onClick={handleShare} className="px-8 py-3 rounded-lg bg-gradient-to-r from-lime-600 to-lime-500 text-black font-bold hover:brightness-110 transition-all uppercase tracking-wide flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(132,204,22,0.4)]">
                        <Share2 size={18} /> Share Profile
                    </button>
                </div>
            </div>

            {/* Image Modal */}
            {imageModal.isOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={closeImageModal}>
                    <div className="relative max-w-4xl max-h-[90vh] animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeImageModal} className="absolute -top-12 right-0 text-white hover:text-lime-500 transition-colors">
                            <X size={32} />
                        </button>
                        <img src={imageModal.url} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
                        {imageModal.caption && (
                            <p className="text-white text-center mt-4 text-sm">{imageModal.caption}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSummary;
