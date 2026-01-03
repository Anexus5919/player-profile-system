import React, { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon, Film, FileText, Play, Plus, Trash2, Trophy, Globe } from "lucide-react";
import { MediaItem, ParticipationRecord } from "../CreateProfile";

const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";

// Helper function to generate thumbnail based on URL type
const getThumbnailForUrl = (url: string): string => {
  const lowerUrl = url.toLowerCase();

  // YouTube thumbnail
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    const videoId = lowerUrl.includes('youtube.com')
      ? url.split('v=')[1]?.split('&')[0]
      : url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI2ZjNGI0NyIvPgo8cGF0aCBkPSJtMTIgNmwxMCAxMC0xMCAxMFYxNnoiIGZpbGw9IiNmZmYiLz4KPHN2Zz4=';
  }

  // Vimeo thumbnail (simplified - would need API call for real implementation)
  if (lowerUrl.includes('vimeo.com')) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzFmZDg1NyIvPgo8cGF0aCBkPSJtMTIgNmwxMCAxMC0xMCAxMFYxNnoiIGZpbGw9IiNmZmYiLz4KPHN2Zz4=';
  }

  // Google Drive links
  if (lowerUrl.includes('drive.google.com')) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0IDIgSDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOGwyLTZ6IiBzdHJva2U9IiMzNGE4NTMiIHN0cm9rZS13aWR0aD0iMiIvPgo8cG9seWxpbmUgcG9pbnRzPSIxNCAyIDE0IDggMjAgOCIgc3Ryb2tlPSIjMzRhODUzIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2Zz4=';
  }

  // PDF files
  if (lowerUrl.includes('.pdf')) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjIwIiB4PSI0IiB5PSIyIiByeD0iMiIgZmlsbD0iI2RjNGI0NyIvPgo8dGV4dCB4PSIxMiIgeT0iMTUiIGZvbnQtc2l6ZT0iOCIgZmlsbD0iI2ZmZiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QREY8L3RleHQ+Cjxzdmc+';
  }

  // Default thumbnail
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzY5NzM4NSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIyIiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Im0xNSA4IDYtNnYxNGEyIDIgMCAwIDEtMiAySGEyIDIgMCAwIDEtMi0yVjYiIGZpbGw9IiNmZmYiLz4KPHN2Zz4=';
};

interface Props {
  media: MediaItem[];
  playerJourney: string;
  participations: ParticipationRecord[];
  onUpdateMedia: (newMedia: MediaItem[]) => void;
  onUpdateJourney: (text: string) => void;
  onUpdateEvent: (eventId: string, updates: Partial<ParticipationRecord>) => void;
  onPreview: () => void;
  onPrevious: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MediaTab: React.FC<Props> = ({ media, playerJourney, participations, onUpdateMedia, onUpdateJourney, onUpdateEvent, onPreview, onPrevious, onSubmit }) => {
  // 'general' or participation ID
  const [selectedContext, setSelectedContext] = useState<string>('general');
  const [activeType, setActiveType] = useState<'image' | 'video' | 'certificate' | 'link'>('image');
  const [videoLink, setVideoLink] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to get current active data
  const isGeneral = selectedContext === 'general';
  const activeEvent = participations.find(p => p.id === selectedContext);

  const currentMedia = isGeneral ? media : (activeEvent?.media || []);
  const currentStory = isGeneral ? playerJourney : (activeEvent?.story || "");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newItems: MediaItem[] = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        type: activeType,
        url: URL.createObjectURL(file),
        caption: file.name
      }));

      if (isGeneral) {
        onUpdateMedia([...media, ...newItems]);
      } else if (activeEvent) {
        onUpdateEvent(activeEvent.id, { media: [...(activeEvent.media || []), ...newItems] });
      }
    }
  };

  const addVideoLink = () => {
    if (!videoLink) return;
    const newItem: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'video',
      url: videoLink,
      caption: 'External Video',
      thumbnail: getThumbnailForUrl(videoLink)
    };

    if (isGeneral) {
      onUpdateMedia([...media, newItem]);
    } else if (activeEvent) {
      onUpdateEvent(activeEvent.id, { media: [...(activeEvent.media || []), newItem] });
    }
    setVideoLink("");
  };

  const addLink = () => {
    if (!linkInput) return;
    const newItem: MediaItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'link',
      url: linkInput,
      caption: linkInput.includes('.pdf') ? 'Certificate PDF' : 'Drive Link',
      thumbnail: getThumbnailForUrl(linkInput)
    };

    if (isGeneral) {
      onUpdateMedia([...media, newItem]);
    } else if (activeEvent) {
      onUpdateEvent(activeEvent.id, { media: [...(activeEvent.media || []), newItem] });
    }
    setLinkInput("");
  };

  const confirmDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const removeMedia = (id: string) => {
    if (isGeneral) {
      onUpdateMedia(media.filter(m => m.id !== id));
    } else if (activeEvent) {
      onUpdateEvent(activeEvent.id, { media: (activeEvent.media || []).filter(m => m.id !== id) });
    }
    setDeleteConfirmId(null);
  };

  const updateStory = (text: string) => {
    if (isGeneral) {
      onUpdateJourney(text);
    } else if (activeEvent) {
      onUpdateEvent(activeEvent.id, { story: text });
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newItems: MediaItem[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        type: activeType,
        url: URL.createObjectURL(file),
        caption: file.name
      }));

      if (isGeneral) {
        onUpdateMedia([...media, ...newItems]);
      } else if (activeEvent) {
        onUpdateEvent(activeEvent.id, { media: [...(activeEvent.media || []), ...newItems] });
      }
    }
  };

  // Filtering for display
  const images = currentMedia.filter(m => m.type === 'image');
  const videos = currentMedia.filter(m => m.type === 'video');
  const certificates = currentMedia.filter(m => m.type === 'certificate');
  const links = currentMedia.filter(m => m.type === 'link');

  return (
    <div className="animate-in fade-in duration-300">

      <div className="border-b border-gray-800 pb-4 mb-6">
        <h3 className="text-white font-bold text-lg uppercase">Media & Experience</h3>
        <p className="text-gray-400 text-xs mt-1">Document your journey. Select an event to add specific highlights.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* --- SIDEBAR: CONTEXT SELECTOR --- */}
        <div className="w-full lg:w-1/4 flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Select Context</label>

          <button
            onClick={() => setSelectedContext('general')}
            className={`text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${selectedContext === 'general' ? 'bg-lime-500/10 border-lime-500 text-lime-500' : 'bg-[#151515] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
          >
            <Globe size={18} />
            <span className="text-sm font-bold">General Profile</span>
          </button>

          <div className="my-2 border-t border-gray-800"></div>

          {participations.length === 0 && <p className="text-[10px] text-gray-600 italic px-2">No tournaments added yet.</p>}

          {participations.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedContext(p.id)}
              className={`text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 group ${selectedContext === p.id ? 'bg-lime-500/10 border-lime-500 text-white' : 'bg-[#151515] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
            >
              <Trophy size={16} className={selectedContext === p.id ? 'text-lime-500' : 'text-gray-600 group-hover:text-gray-400'} />
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{p.tournamentName}</p>
                <p className="text-[10px] opacity-60 truncate">{p.date}</p>
              </div>
            </button>
          ))}
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex-1 bg-[#151515] rounded-xl border border-gray-800 p-6 min-h-[500px]">

          <div className="mb-6 flex items-center justify-between">
            <h4 className="text-xl font-black text-white uppercase italic tracking-tight">
              {isGeneral ? "General Highlights" : activeEvent?.tournamentName}
            </h4>
            <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-1 rounded border border-gray-700">
              {isGeneral ? "Public Profile" : activeEvent?.level}
            </span>
          </div>

          {/* Story Input */}
          <div className="mb-8">
            <label className={labelStyle}>{isGeneral ? "My Journey / Bio" : "My Experience at this Event"}</label>
            <textarea
              value={currentStory}
              onChange={(e) => updateStory(e.target.value)}
              className={`${inputBaseStyle} h-28 resize-none leading-relaxed bg-[#1a1a1a] focus:bg-[#222]`}
              placeholder={isGeneral ? "Tell the world who you are..." : "Describe your performance, key moments, and what you learned..."}
            />
          </div>

          {/* Media Type Tabs */}
          <div className="flex gap-4 border-b border-gray-800 mb-6">
            {[
              { type: 'image', label: 'Photos', icon: ImageIcon },
              { type: 'video', label: 'Videos', icon: Film },
              { type: 'certificate', label: 'Certificates', icon: FileText },
              { type: 'link', label: 'Links', icon: Globe }
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setActiveType(type as any)}
                className={`pb-2 text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2 ${activeType === type ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* Upload Zone */}
          <div
            className={`bg-[#1a1a1a] p-6 rounded-xl border-2 border-dashed transition-all mb-6 ${isDragging
              ? 'border-lime-500 bg-lime-500/10 scale-[1.02]'
              : 'border-gray-700 hover:border-lime-500/50 group'
              }`}
            onDragOver={activeType !== 'video' && activeType !== 'link' ? handleDragOver : undefined}
            onDragLeave={activeType !== 'video' && activeType !== 'link' ? handleDragLeave : undefined}
            onDrop={activeType !== 'video' && activeType !== 'link' ? handleDrop : undefined}
          >
            {activeType === 'video' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Paste Link (YouTube/Vimeo)"
                  className={inputBaseStyle}
                />
                <button onClick={addVideoLink} className="bg-lime-500 text-black px-4 rounded font-bold hover:brightness-110"><Plus size={20} /></button>
              </div>
            ) : activeType === 'link' ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Paste Drive Link or PDF URL"
                  className={inputBaseStyle}
                />
                <button onClick={addLink} className="bg-lime-500 text-black px-4 rounded font-bold hover:brightness-110"><Plus size={20} /></button>
              </div>
            ) : (
              <div className="text-center cursor-pointer py-4" onClick={() => fileInputRef.current?.click()}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${isDragging
                  ? 'bg-lime-500/20 text-lime-500 scale-110'
                  : 'bg-gray-800 text-gray-400 group-hover:text-lime-500'
                  }`}>
                  <Upload size={22} />
                </div>
                <p className={`text-sm font-medium transition-colors ${isDragging ? 'text-lime-500' : 'text-gray-400'}`}>
                  {isDragging
                    ? 'Drop files here...'
                    : `Click or Drag & Drop ${activeType === 'image' ? 'Photos' : 'Certificates'}`
                  }
                </p>
                <p className="text-[10px] text-gray-600 mt-1">
                  {activeType === 'image' ? 'JPG, PNG, GIF supported' : 'Images & PDFs supported'}
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept={activeType === 'image' ? "image/*" : "image/*,.pdf"}
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          {/* Grid Display - Separated by Type */}
          <div className="space-y-6">
            {/* Photos Section */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon size={14} className="text-lime-500" />
                  <h5 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Photos ({images.length})</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map(img => (
                    <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-700 hover:border-lime-500/50 transition-colors">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button onClick={() => confirmDelete(img.id)} className="absolute top-1 right-1 bg-red-500 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {videos.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Film size={14} className="text-red-500" />
                  <h5 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Videos ({videos.length})</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {videos.map(vid => (
                    <div key={vid.id} className="bg-[#1a1a1a] rounded-lg border border-gray-700 hover:border-red-500/50 transition-colors overflow-hidden group relative">
                      {vid.thumbnail ? (
                        <div className="aspect-video relative">
                          <img src={vid.thumbnail} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Play size={24} className="text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video bg-gray-800 flex items-center justify-center">
                          <Play size={24} className="text-gray-500" />
                        </div>
                      )}
                      <div className="p-2">
                        <span className="text-[10px] text-gray-400 truncate block">{vid.url}</span>
                      </div>
                      <button onClick={() => confirmDelete(vid.id)} className="absolute top-1 right-1 bg-red-500 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Section */}
            {certificates.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={14} className="text-yellow-500" />
                  <h5 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Certificates ({certificates.length})</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {certificates.map(cert => (
                    <div key={cert.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors flex items-center gap-3 relative group">
                      <div className="w-10 h-10 bg-red-500/20 rounded flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-red-400" />
                      </div>
                      <span className="text-xs text-gray-300 truncate flex-1">{cert.caption}</span>
                      <button onClick={() => confirmDelete(cert.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links Section */}
            {links.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={14} className="text-blue-500" />
                  <h5 className="text-xs uppercase font-bold text-gray-500 tracking-wider">Links ({links.length})</h5>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {links.map(link => {
                    const isPdf = link.url.toLowerCase().includes('.pdf');
                    const isDrive = link.url.toLowerCase().includes('drive.google.com');
                    return (
                      <div key={link.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors flex items-center gap-3 relative group">
                        {isPdf ? (
                          <div className="w-10 h-10 bg-red-500/20 rounded flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-red-400" />
                          </div>
                        ) : isDrive ? (
                          <div className="w-10 h-10 bg-green-500/20 rounded flex items-center justify-center shrink-0">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-blue-500/20 rounded flex items-center justify-center shrink-0">
                            <Globe size={18} className="text-blue-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-300 truncate block">{link.caption}</span>
                          <span className="text-[10px] text-gray-500 truncate block">{link.url}</span>
                        </div>
                        <button onClick={() => confirmDelete(link.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800 items-center">
        <button type="button" onClick={onPreview} className="px-6 py-2.5 rounded-md border border-lime-500 text-lime-500 font-medium hover:bg-lime-500/10 transition-colors uppercase tracking-wide text-sm">Preview</button>
        <div className="flex gap-3">
          <button type="button" onClick={onPrevious} className="px-6 py-2.5 rounded-md bg-gray-800 border border-gray-700 text-gray-300 font-bold hover:bg-gray-700 hover:text-white transition-all uppercase tracking-wide flex items-center gap-2 text-sm"><ArrowLeft size={16} /> Previous</button>
          <button type="button" onClick={onSubmit} className="px-8 py-2.5 rounded-md bg-gradient-to-r from-lime-600 to-lime-500 text-black font-bold hover:brightness-110 transition-all uppercase tracking-wide flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(132,204,22,0.4)]">Submit Profile <ArrowRight size={16} /></button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-700 p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="text-white font-bold text-lg">Delete Media?</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this media? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={() => removeMedia(deleteConfirmId)} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTab;