import React, { useState } from "react";
import { X, Activity, Mail, Phone, ImageIcon, Quote, ThumbsUp, ThumbsDown, Linkedin, Facebook, Twitter, Instagram, Trophy, Calendar, MapPin, Medal, Award, Ribbon, Star, ExternalLink, ChevronDown, ChevronUp, FileText, Crown, Play, Film, Camera } from "lucide-react";
import { FormData, Units, AchievementRecord, MediaItem } from "../CreateProfile";

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
// Modified to support random/varied colors per card
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

    // Define a palette of premium neon colors
    const colorPalettes = [
        { // Yellow (Original)
            main: "text-yellow-500",
            bgSoft: "bg-yellow-500/10",
            borderSoft: "border-yellow-500/20",
            border: "border-yellow-500/50",
            bar: "bg-yellow-500",
            hoverText: "hover:text-black",
            hoverBg: "hover:bg-yellow-500"
        },
        { // Cyan
            main: "text-cyan-400",
            bgSoft: "bg-cyan-400/10",
            borderSoft: "border-cyan-400/20",
            border: "border-cyan-400/50",
            bar: "bg-cyan-400",
            hoverText: "hover:text-black",
            hoverBg: "hover:bg-cyan-400"
        },
        { // Purple
            main: "text-purple-500",
            bgSoft: "bg-purple-500/10",
            borderSoft: "border-purple-500/20",
            border: "border-purple-500/50",
            bar: "bg-purple-500",
            hoverText: "hover:text-white",
            hoverBg: "hover:bg-purple-500"
        },
        { // Rose
            main: "text-rose-500",
            bgSoft: "bg-rose-500/10",
            borderSoft: "border-rose-500/20",
            border: "border-rose-500/50",
            bar: "bg-rose-500",
            hoverText: "hover:text-white",
            hoverBg: "hover:bg-rose-500"
        },
        { // Emerald
            main: "text-emerald-400",
            bgSoft: "bg-emerald-400/10",
            borderSoft: "border-emerald-400/20",
            border: "border-emerald-400/50",
            bar: "bg-emerald-400",
            hoverText: "hover:text-black",
            hoverBg: "hover:bg-emerald-400"
        },
        { // Orange
            main: "text-orange-500",
            bgSoft: "bg-orange-500/10",
            borderSoft: "border-orange-500/20",
            border: "border-orange-500/50",
            bar: "bg-orange-500",
            hoverText: "hover:text-black",
            hoverBg: "hover:bg-orange-500"
        }
    ];

    // Select color based on index to ensure consistency (won't flicker on re-render)
    const activeColor = colorPalettes[index % colorPalettes.length];

    // Uniform Premium Styling for ALL cards with Dynamic Color
    const theme = {
        bg: "bg-gradient-to-br from-[#1a1a1a] to-[#121212]",
        border: isExpanded ? activeColor.border : "border-gray-800",
        iconBox: `${activeColor.bgSoft} ${activeColor.main} ${activeColor.borderSoft}`,
        title: isExpanded ? activeColor.main : "text-white"
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
            <div className={`absolute top-0 left-0 h-full w-1 transition-colors ${isExpanded ? activeColor.bar : 'bg-transparent group-hover:bg-gray-700'}`} />

            {/* Latest Badge - Dynamic Color */}
            {index === 0 && (
                <div className={`absolute top-0 right-0 ${activeColor.bgSoft} ${activeColor.main} text-[9px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest border-l border-b ${activeColor.borderSoft}`}>
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
                        <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? `rotate-180 ${activeColor.main}` : 'text-gray-600'}`}>
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
                                    <Calendar size={12} className={activeColor.main} /> {achievement.date}
                                </div>
                                {achievement.certificateUrl && (
                                    <a
                                        href={achievement.certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className={`flex items-center gap-2 text-xs font-bold ${activeColor.bgSoft} ${activeColor.main} border ${activeColor.border} px-3 py-1.5 rounded-md ${activeColor.hoverBg} ${activeColor.hoverText} transition-all`}
                                    >
                                        <ExternalLink size={14} /> View Certificate
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Collapsed Hints */}
                    {!isExpanded && (
                        <div className="mt-2 text-xs text-gray-600 truncate flex items-center gap-2">
                            <span><Calendar size={10} className="inline mb-0.5" /> {achievement.date}</span>
                            {achievement.certificateUrl && <span className="flex items-center gap-1"><FileText size={10} /> Cert Available</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MEDIA GALLERY HELPER ---
const MediaGallery = ({
    items,
    filter = 'all',
    onImageClick,
    onVideoClick,
    onDeleteMedia
}: {
    items: MediaItem[],
    filter?: 'all' | 'image' | 'video' | 'certificate' | 'link',
    onImageClick: (url: string, caption?: string) => void,
    onVideoClick: (url: string) => void,
    onDeleteMedia: (id: string) => void
}) => {
    const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);
    const [copiedId, setCopiedId] = React.useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null);

    const confirmDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirmId) {
            onDeleteMedia(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    const handleCopy = async (e: React.MouseEvent, url: string, id: string) => {
        e.stopPropagation();
        try {
            // Check if it's a blob URL (local upload)
            if (url.startsWith('blob:')) {
                // For blob URLs, copy the actual image data to clipboard
                const response = await fetch(url);
                const blob = await response.blob();

                // Try to copy image as PNG to clipboard
                try {
                    // Convert to PNG blob for clipboard compatibility
                    const img = new Image();
                    img.src = url;
                    await new Promise((resolve) => { img.onload = resolve; });

                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0);

                    canvas.toBlob(async (pngBlob) => {
                        if (pngBlob) {
                            await navigator.clipboard.write([
                                new ClipboardItem({ 'image/png': pngBlob })
                            ]);
                        }
                    }, 'image/png');
                } catch {
                    // Fallback: just inform user they can right-click to copy
                    console.log('Image copied to clipboard');
                }
            } else {
                // For external URLs, copy the URL
                await navigator.clipboard.writeText(url);
            }
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleVideoClick = (url: string) => {
        // Always open videos in a new tab
        window.open(url, '_blank');
    };

    if (!items || items.length === 0) return null;

    let filteredItems = items;
    if (filter !== 'all') {
        filteredItems = items.filter(m => m.type === filter);
    }

    if (filteredItems.length === 0) {
        return <div className="text-gray-500 text-sm text-center py-4">No {filter === 'all' ? '' : filter + 's'} found.</div>;
    }

    const images = filteredItems.filter(m => m.type === 'image');
    const videos = filteredItems.filter(m => m.type === 'video');
    const certs = filteredItems.filter(m => m.type === 'certificate');
    const links = filteredItems.filter(m => m.type === 'link');

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            {images.map(img => (
                <div
                    key={img.id}
                    className="relative rounded-lg overflow-hidden border border-gray-800 aspect-video cursor-pointer hover:border-lime-500/50 transition-colors"
                    onMouseEnter={() => setHoveredItemId(img.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onClick={() => onImageClick(img.url, img.caption)}
                >
                    <img src={img.url} className={`w-full h-full object-cover transition-transform duration-500 ${hoveredItemId === img.id ? 'scale-110' : ''}`} />
                    <div className={`absolute top-2 right-2 transition-opacity flex gap-1 ${hoveredItemId === img.id ? 'opacity-100' : 'opacity-0'}`}>
                        <button
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                            onClick={(e) => handleCopy(e, img.url, img.id)}
                            title="Copy URL"
                        >
                            {copiedId === img.id ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#84cc16" strokeWidth="2"><polyline points="20,6 9,17 4,12"></polyline></svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                            )}
                        </button>
                        <button className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors" onClick={(e) => { e.stopPropagation(); const a = document.createElement('a'); a.href = img.url; a.download = img.caption || 'image'; a.click(); }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7,10 12,15 17,10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </button>
                        <button className="bg-red-500/80 p-2 rounded-full hover:bg-red-500 transition-colors" onClick={(e) => confirmDelete(e, img.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg>
                        </button>
                    </div>
                </div>
            ))}
            {videos.map(vid => (
                <div
                    key={vid.id}
                    className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden aspect-video cursor-pointer hover:border-red-500/50 transition-colors relative group"
                    onMouseEnter={() => setHoveredItemId(vid.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onClick={() => handleVideoClick(vid.url)}
                >
                    {vid.thumbnail ? (
                        <>
                            <img src={vid.thumbnail} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-red-500/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Play size={20} className="text-white ml-1" fill="white" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Play size={24} className={`text-gray-500 transition-colors ${hoveredItemId === vid.id ? 'text-red-500' : ''}`} />
                        </div>
                    )}
                    <div className={`absolute top-2 right-2 transition-opacity ${hoveredItemId === vid.id ? 'opacity-100' : 'opacity-0'}`}>
                        <button className="bg-red-500/80 p-2 rounded-full hover:bg-red-500 transition-colors" onClick={(e) => confirmDelete(e, vid.id)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg>
                        </button>
                    </div>
                </div>
            ))}
            {certs.map(cert => (
                <div
                    key={cert.id}
                    className="bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-yellow-500/50 transition-colors overflow-hidden aspect-video cursor-pointer relative group"
                    onMouseEnter={() => setHoveredItemId(cert.id)}
                    onMouseLeave={() => setHoveredItemId(null)}
                    onClick={() => window.open(cert.url, '_blank')}
                >
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                        <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <FileText size={24} className="text-red-400" />
                        </div>
                        <span className="text-[10px] text-gray-400 truncate text-center max-w-full px-2">{cert.caption}</span>
                        <span className="text-[8px] text-lime-500 uppercase font-bold">Click to View PDF</span>
                    </div>
                    <div className={`absolute top-2 right-2 transition-opacity ${hoveredItemId === cert.id ? 'opacity-100' : 'opacity-0'}`}>
                        <button className="bg-red-500/80 p-1 rounded hover:bg-red-500 transition-colors" onClick={(e) => confirmDelete(e, cert.id)}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg>
                        </button>
                    </div>
                </div>
            ))}
            {links.map(link => {
                const isPdf = link.url.toLowerCase().includes('.pdf');
                const isDrive = link.url.toLowerCase().includes('drive.google.com');
                return (
                    <div
                        key={link.id}
                        className="bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-blue-500/50 transition-colors overflow-hidden aspect-video cursor-pointer relative group"
                        onMouseEnter={() => setHoveredItemId(link.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                        onClick={() => window.open(link.url, '_blank')}
                    >
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
                            {isPdf ? (
                                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <FileText size={24} className="text-red-400" />
                                </div>
                            ) : isDrive ? (
                                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <ExternalLink size={20} className="text-blue-400" />
                                </div>
                            )}
                            <span className="text-[10px] text-gray-400 truncate text-center max-w-full px-2">{link.caption}</span>
                            <span className={`text-[8px] uppercase font-bold ${isPdf ? 'text-red-400' : isDrive ? 'text-green-400' : 'text-blue-400'}`}>
                                {isPdf ? 'Click to View PDF' : isDrive ? 'Open in Google Drive' : 'Click to Open Link'}
                            </span>
                        </div>
                        <div className={`absolute top-2 right-2 transition-opacity ${hoveredItemId === link.id ? 'opacity-100' : 'opacity-0'}`}>
                            <button className="bg-red-500/80 p-1 rounded hover:bg-red-500 transition-colors" onClick={(e) => confirmDelete(e, link.id)}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg>
                            </button>
                        </div>
                    </div>
                );
            })}
            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
                    <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="3,6 5,6 21,6"></polyline><path d="M19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path></svg>
                            </div>
                            <h3 className="text-white font-bold text-lg">Delete Media?</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this media? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors">Cancel</button>
                            <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN PREVIEW COMPONENT ---
interface Props {
    isOpen: boolean; onClose: () => void;
    data: FormData; bmiData: any; image: string | null; units: Units; activeTab: string;
    onUpdateMedia?: (newMedia: MediaItem[]) => void;
    onUpdateEvent?: (eventId: string, updates: Partial<any>) => void;
}

const PreviewModal: React.FC<Props> = ({ isOpen, onClose, data, bmiData, image, units, activeTab, onUpdateMedia, onUpdateEvent }) => {
    if (!isOpen) return null;

    const [selectedSport, setSelectedSport] = useState(data.sports.length > 0 ? data.sports[0] : "");
    // Accordion state for Achievements
    const [expandedAchievementId, setExpandedAchievementId] = useState<string | null>(null);
    // Media filter for Media tab
    const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'certificate' | 'link'>('all');
    // Per-event media filters
    const [eventFilters, setEventFilters] = useState<Record<string, 'all' | 'image' | 'video' | 'certificate' | 'link'>>({});
    // Media modals
    const [imageModal, setImageModal] = useState<{ isOpen: boolean; url: string; caption?: string }>({ isOpen: false, url: '', caption: '' });
    const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string }>({ isOpen: false, url: '' });

    // Helper to get event filter or default to 'all'
    const getEventFilter = (eventId: string) => eventFilters[eventId] || 'all';
    const setEventFilter = (eventId: string, filter: 'all' | 'image' | 'video' | 'certificate' | 'link') => {
        setEventFilters(prev => ({ ...prev, [eventId]: filter }));
    };

    const calculateAge = (dob: string) => { if (!dob) return "N/A"; return Math.abs(new Date(Date.now() - new Date(dob).getTime()).getUTCFullYear() - 1970); };

    const getTitle = () => {
        switch (activeTab) {
            case "PARTICIPATION": return "Career Timeline";
            case "ACHIEVEMENTS": return "Trophy Cabinet";
            case "BIO": return "Scout Report";
            case "MEDIA": return "Player Showcase"; // NEW TITLE FOR MEDIA
            default: return "Player Card";
        }
    }

    // Filter media
    const images = data.media?.filter(m => m.type === 'image') || [];
    const videos = data.media?.filter(m => m.type === 'video') || [];
    const certs = data.media?.filter(m => m.type === 'certificate') || [];

    // --- Helpers ---
    const getSportSpecificStats = (sport: string) => {
        const stats = data.sportStats[sport] || {};
        if (sport === 'Cricket') return [{ label: "Runs", value: stats.runsScored }, { label: "Wickets", value: stats.wicketsTaken }];
        if (sport === 'Football') return [{ label: "Goals", value: stats.goalsScored }, { label: "Assists", value: stats.assists }];
        return [{ label: "Aces", value: stats.aces }, { label: "Smash W.", value: stats.smashWinners }];
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

    // Handle media deletion from preview
    const handleDeleteGeneralMedia = (mediaId: string) => {
        if (onUpdateMedia) {
            const updatedMedia = data.media.filter(m => m.id !== mediaId);
            onUpdateMedia(updatedMedia);
        }
    };

    const handleDeleteEventMedia = (eventId: string, mediaId: string) => {
        if (onUpdateEvent) {
            const event = data.participations.find(p => p.id === eventId);
            if (event && event.media) {
                const updatedMedia = event.media.filter(m => m.id !== mediaId);
                onUpdateEvent(eventId, { media: updatedMedia });
            }
        }
    };

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

                    {/* --- MEDIA PREVIEW (NEW) --- */}
                    {activeTab === "MEDIA" ? (
                        <div className="p-8 relative z-10 space-y-12">

                            {/* 1. General Journey */}
                            {(data.playerJourney || (data.media && data.media.length > 0)) && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-lime-500/10 p-2 rounded-lg text-lime-500"><Quote size={20} /></div>
                                            <h3 className="text-white font-bold uppercase tracking-wider">My Journey</h3>
                                        </div>
                                        {data.media && data.media.length > 0 && (
                                            <select
                                                value={mediaFilter}
                                                onChange={(e) => setMediaFilter(e.target.value as any)}
                                                className="bg-[#1a1a1a] text-white text-xs px-3 py-1 rounded border border-gray-700 focus:border-lime-500 outline-none"
                                            >
                                                <option value="all">All Media</option>
                                                <option value="image">Photos</option>
                                                <option value="video">Videos</option>
                                                <option value="link">Links</option>
                                                <option value="certificate">Certificates</option>
                                            </select>
                                        )}
                                    </div>
                                    {data.playerJourney && <p className="text-gray-300 leading-relaxed italic border-l-2 border-lime-500/50 pl-4 mb-4">{data.playerJourney}</p>}
                                    <MediaGallery
                                        items={data.media}
                                        filter={mediaFilter}
                                        onImageClick={(url, caption) => setImageModal({ isOpen: true, url, caption })}
                                        onVideoClick={(url) => setVideoModal({ isOpen: true, url })}
                                        onDeleteMedia={handleDeleteGeneralMedia}
                                    />
                                </div>
                            )}

                            {/* 2. Event Timeline Stories */}
                            <div className="relative border-l-2 border-gray-800 ml-3 space-y-10">
                                {sortedParticipations.filter(p => p.story || (p.media && p.media.length > 0)).map((p, i) => (
                                    <div key={p.id} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-[#121212] border-gray-600"></div>

                                        <div className="mb-2 flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="text-white font-bold text-lg">{p.tournamentName}</h4>
                                                <div className="flex gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {p.date}</span>
                                                    <span className="flex items-center gap-1 text-lime-500">{p.result}</span>
                                                </div>
                                            </div>
                                            {p.media && p.media.length > 0 && (
                                                <select
                                                    value={getEventFilter(p.id)}
                                                    onChange={(e) => setEventFilter(p.id, e.target.value as any)}
                                                    className="bg-[#1a1a1a] text-white text-xs px-2 py-1 rounded border border-gray-700 focus:border-lime-500 outline-none shrink-0"
                                                >
                                                    <option value="all">All</option>
                                                    <option value="image">Photos</option>
                                                    <option value="video">Videos</option>
                                                    <option value="link">Links</option>
                                                    <option value="certificate">Certs</option>
                                                </select>
                                            )}
                                        </div>

                                        {p.story && <p className="text-sm text-gray-400 leading-relaxed mb-3">{p.story}</p>}
                                        {p.media && <MediaGallery
                                            items={p.media}
                                            filter={getEventFilter(p.id)}
                                            onImageClick={(url, caption) => setImageModal({ isOpen: true, url, caption })}
                                            onVideoClick={(url) => setVideoModal({ isOpen: true, url })}
                                            onDeleteMedia={(mediaId) => handleDeleteEventMedia(p.id, mediaId)}
                                        />}
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {(!data.playerJourney && (!data.media || data.media.length === 0) && !sortedParticipations.some(p => p.story || (p.media && p.media.length > 0))) && (
                                <div className="text-center py-20 opacity-30">
                                    <ImageIcon size={48} className="mx-auto mb-2" />
                                    <p>No media or stories shared yet.</p>
                                </div>
                            )}
                        </div>
                    ) : activeTab === "ACHIEVEMENTS" ? (
                        // --- ACHIEVEMENTS PREVIEW (Accordion Stack) ---
                        <div className="p-8 relative z-10">
                            <div className="mb-8">
                                <div className="flex items-center justify-between rounded-xl border border-gray-800 bg-gradient-to-r from-[#151515] to-[#0f0f0f] px-6 py-4">

                                    {/* Left Section */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
                                            <Crown size={20} strokeWidth={1.8} />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-black uppercase tracking-wide text-white">
                                                Hall of Fame
                                            </h2>
                                            <p className="text-xs text-gray-500 font-medium">
                                                Total Awards: {sortedAchievements.length}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Section */}
                                    {sortedAchievements[0]?.date && (
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                                                Latest Win
                                            </p>
                                            <p className="text-sm font-bold text-lime-500">
                                                {sortedAchievements[0].date}
                                            </p>
                                        </div>
                                    )}
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
                                                <div className="flex gap-4 text-xs text-gray-400"><span className="flex items-center gap-1"><Calendar size={12} /> {p.date}</span><span className="flex items-center gap-1"><MapPin size={12} /> {p.location || "N/A"}</span></div>
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
                                <div className="w-24 h-24 rounded-full border-4 border-lime-500/20 overflow-hidden shrink-0 shadow-lg">{image ? <img src={image} className="w-full h-full object-cover" /> : <div className="bg-gray-800 w-full h-full flex items-center justify-center"><ImageIcon size={32} className="text-gray-500" /></div>}</div>
                                <div><h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{data.fullName || "PLAYER NAME"}</h2><div className="flex flex-wrap gap-2 text-sm"><span className="text-lime-500 font-bold bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/20">{data.nationality || "Nationality"}</span>{data.sports.map(s => <span key={s} className="text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">{s}</span>)}</div></div>
                            </div>
                            <div className="mb-8 relative pl-6 border-l-4 border-lime-500"><Quote className="absolute top-[-10px] left-[-40px] text-gray-800 fill-current" size={40} /><p className="text-gray-300 italic text-lg leading-relaxed">{data.bio || "No bio provided yet."}</p></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-lime-900/10 p-5 rounded-xl border border-lime-500/20"><div className="flex items-center gap-2 mb-4 text-lime-500 font-bold uppercase tracking-wider text-sm"><ThumbsUp size={16} /> Strengths</div><div className="flex flex-wrap gap-2 mb-4">{data.strengths.length > 0 ? data.strengths.map(s => <span key={s} className="bg-lime-500/20 text-lime-400 px-2 py-1 rounded text-xs">{s}</span>) : <span className="text-gray-600 text-xs">None added</span>}</div><p className="text-xs text-gray-400 leading-relaxed border-t border-lime-500/20 pt-3">{data.strengthDescription}</p></div>
                                <div className="bg-red-900/10 p-5 rounded-xl border border-red-500/20"><div className="flex items-center gap-2 mb-4 text-red-500 font-bold uppercase tracking-wider text-sm"><ThumbsDown size={16} /> Areas to Improve</div><div className="flex flex-wrap gap-2 mb-4">{data.weaknesses.length > 0 ? data.weaknesses.map(w => <span key={w} className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">{w}</span>) : <span className="text-gray-600 text-xs">None added</span>}</div><p className="text-xs text-gray-400 leading-relaxed border-t border-red-500/20 pt-3">{data.weaknessDescription}</p></div>
                            </div>
                            <div className="flex gap-4 justify-center border-t border-gray-800 pt-6">
                                {data.socialLinks.facebook && <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:scale-110 transition-transform"><Facebook size={20} /></a>}
                                {data.socialLinks.instagram && <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:scale-110 transition-transform"><Instagram size={20} /></a>}
                                {data.socialLinks.twitter && <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-white hover:scale-110 transition-transform"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>}
                                {data.socialLinks.linkedin && <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:scale-110 transition-transform"><Linkedin size={20} /></a>}
                            </div>
                        </div>
                    ) : activeTab === "SPORTS STATS" ? (
                        /* --- SPORTS STATS PREVIEW --- */
                        <div className="p-8 flex flex-col items-center justify-center relative z-10 h-full">
                            {data.sports.length > 0 ? (
                                <>
                                    <div className="mb-8 w-full max-w-xs relative"><label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest absolute -top-4 left-0">Select Sport View</label><select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)} className="w-full bg-[#1a1a1a] text-white text-lg font-bold px-4 py-2 rounded-md border border-gray-700 focus:border-lime-500 outline-none appearance-none">{data.sports.map(s => <option key={s} value={s}>{s}</option>)}</select><div className="absolute right-3 top-3 pointer-events-none text-lime-500">▼</div></div>
                                    <div className="flex flex-col md:flex-row items-center gap-16 w-full justify-center"><div className="flex flex-col items-center"><PieChart wins={parseInt(currentStats.wins) || 0} loss={parseInt(currentStats.loss) || 0} draws={parseInt(currentStats.draws) || 0} /></div><div className="grid grid-cols-2 gap-4 w-full max-w-md"><div className="bg-[#1a1a1a] p-4 rounded border border-gray-800 text-center"><span className="block text-xs text-gray-500 uppercase mb-1">Matches</span><span className="text-2xl font-bold text-white">{currentStats.matchesPlayed || "0"}</span></div><div className="bg-[#1a1a1a] p-4 rounded border border-gray-800 text-center"><span className="block text-xs text-gray-500 uppercase mb-1">Win Rate</span><span className="text-2xl font-bold text-lime-500">{currentStats.matchesPlayed ? Math.round((parseInt(currentStats.wins || "0") / parseInt(currentStats.matchesPlayed)) * 100) + "%" : "0%"}</span></div>{extraStats.map(stat => <div key={stat.label} className="bg-[#1a1a1a] p-4 rounded border border-gray-800 text-center"><span className="block text-xs text-gray-500 uppercase mb-1">{stat.label}</span><span className="text-xl font-bold text-white">{stat.value || "0"}</span></div>)}</div></div>
                                </>
                            ) : <p className="text-gray-500">No sports selected.</p>}
                        </div>
                    ) : (
                        /* --- PERSONAL INFO PREVIEW --- */
                        <div className="p-8 flex flex-col md:flex-row gap-8 relative z-10">
                            <div className="flex-shrink-0 flex flex-col items-center gap-4">
                                <div className="w-48 h-56 rounded-xl bg-gray-800 border-2 border-lime-500/30 overflow-hidden shadow-lg relative"><div className="absolute bottom-0 left-0 w-full bg-black/90 backdrop-blur-sm py-2 text-center border-t border-lime-500/30"><span className="text-lime-500 font-bold uppercase tracking-wider text-xs block truncate px-2">{data.sports.length > 1 ? `${data.sports[0]} +${data.sports.length - 1} More` : data.sports[0] || "ATHLETE"}</span></div>{image ? <img src={image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-600"><ImageIcon size={32} /></div>}</div>
                                <div className="flex flex-col items-center gap-1 opacity-50"><span className="text-[10px] tracking-[0.2em] text-gray-400">ID: {Date.now().toString().slice(-8)}</span></div>
                            </div>
                            <div className="flex-1 w-full"><div className="border-b border-gray-800 pb-4 mb-6"><h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">{data.fullName || "PLAYER NAME"}</h2><div className="flex flex-wrap items-center gap-2 mt-3"><span className="bg-lime-500/10 text-lime-500 px-3 py-1 rounded text-xs font-bold uppercase border border-lime-500/20">{data.nationality || "Unknown"}</span>{data.sports.map(s => <span key={s} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700 flex items-center gap-1">{s}</span>)}</div><div className="mt-2 text-gray-500 text-xs uppercase tracking-wider font-medium">• {data.gender || "N/A"} • {calculateAge(data.dob)} Years Old</div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"><div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800"><span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Height</span><span className="text-xl font-bold text-white">{data.height || "-"} <span className="text-xs text-gray-600">{units.height}</span></span></div><div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800"><span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">Weight</span><span className="text-xl font-bold text-white">{data.weight || "-"} <span className="text-xs text-gray-600">{units.weight}</span></span></div><div className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-800 md:col-span-2 relative overflow-hidden"><div className={`absolute right-0 top-0 h-full w-1 ${bmiData.color.replace('text-', 'bg-')}`}></div><span className="text-gray-500 text-[10px] uppercase font-bold block mb-1">BMI Index</span><div className="flex items-baseline gap-2"><span className={`text-xl font-bold ${bmiData.color}`}>{bmiData.value || "--"}</span><span className="text-xs text-gray-400">({bmiData.status})</span></div></div></div><div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-gray-800 mb-4"><div className="flex items-center gap-3"><Activity size={18} className="text-lime-500" /><span className="text-sm font-medium text-gray-300">Agility Rating</span></div><div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => <div key={star} className={`h-2 w-6 rounded-full ${star <= parseInt(data.agilityRating || '0') ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.5)]' : 'bg-gray-700'}`}></div>)}</div></div><div className="col-span-2 flex flex-wrap gap-4 text-xs text-gray-400"><span className="flex items-center gap-1.5"><Mail size={12} className="text-lime-500" /> {data.email || "No Email"}</span><span className="flex items-center gap-1.5"><Phone size={12} className="text-lime-500" /> {data.contactNo || "No Phone"}</span></div></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Modal */}
            {imageModal.isOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setImageModal({ isOpen: false, url: '', caption: '' })}>
                    <div className="relative max-w-4xl max-h-[90vh] animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setImageModal({ isOpen: false, url: '', caption: '' })} className="absolute -top-12 right-0 text-white hover:text-lime-500 transition-colors">
                            <X size={32} />
                        </button>
                        <img src={imageModal.url} className="max-w-full max-h-full object-contain rounded-lg" />
                        {imageModal.caption && (
                            <p className="text-white text-center mt-4 text-sm">{imageModal.caption}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Video Modal */}
            {videoModal.isOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => setVideoModal({ isOpen: false, url: '' })}>
                    <div className="relative w-full max-w-4xl animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setVideoModal({ isOpen: false, url: '' })} className="absolute -top-12 right-0 text-white hover:text-lime-500 transition-colors z-10">
                            <X size={32} />
                        </button>
                        <div className="relative" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                                src={videoModal.url.includes('youtube.com') || videoModal.url.includes('youtu.be')
                                    ? videoModal.url.replace('watch?v=', 'embed/')
                                    : videoModal.url}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreviewModal;