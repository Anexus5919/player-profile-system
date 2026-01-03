import React, { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon, Film, FileText, Play, Plus, Trash2, Trophy, Globe } from "lucide-react";
import { MediaItem, ParticipationRecord } from "../CreateProfile";

const inputBaseStyle = "w-full bg-[#2C2C2C] text-gray-200 rounded-md px-3 py-2.5 outline-none focus:ring-1 focus:ring-lime-500 transition-all placeholder-gray-500 text-sm border border-transparent focus:border-lime-500/50";
const labelStyle = "block text-[#a3a3a3] text-sm mb-1.5 font-medium";

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
  const [activeType, setActiveType] = useState<'image' | 'video' | 'certificate'>('image');
  const [videoLink, setVideoLink] = useState("");
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
      caption: 'External Video'
    };
    
    if (isGeneral) {
        onUpdateMedia([...media, newItem]);
    } else if (activeEvent) {
        onUpdateEvent(activeEvent.id, { media: [...(activeEvent.media || []), newItem] });
    }
    setVideoLink("");
  };

  const removeMedia = (id: string) => {
      if (isGeneral) {
          onUpdateMedia(media.filter(m => m.id !== id));
      } else if (activeEvent) {
          onUpdateEvent(activeEvent.id, { media: (activeEvent.media || []).filter(m => m.id !== id) });
      }
  };

  const updateStory = (text: string) => {
      if (isGeneral) {
          onUpdateJourney(text);
      } else if (activeEvent) {
          onUpdateEvent(activeEvent.id, { story: text });
      }
  };

  // Filtering for display
  const images = currentMedia.filter(m => m.type === 'image');
  const videos = currentMedia.filter(m => m.type === 'video');
  const certificates = currentMedia.filter(m => m.type === 'certificate');

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
                {['image', 'video', 'certificate'].map((type) => (
                    <button
                    key={type}
                    onClick={() => setActiveType(type as any)}
                    className={`pb-2 text-sm font-bold uppercase tracking-wide transition-colors flex items-center gap-2 ${activeType === type ? 'text-lime-500 border-b-2 border-lime-500' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                    {type === 'image' && <ImageIcon size={16}/>}
                    {type === 'video' && <Film size={16}/>}
                    {type === 'certificate' && <FileText size={16}/>}
                    {type === 'image' ? 'Photos' : type === 'video' ? 'Videos' : 'Certificates'}
                    </button>
                ))}
              </div>

              {/* Upload Zone */}
              <div className="bg-[#1a1a1a] p-6 rounded-xl border border-dashed border-gray-700 hover:border-lime-500/50 transition-colors group mb-6">
                {activeType === 'video' ? (
                    <div className="flex gap-2">
                        <input 
                        type="text" 
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                        placeholder="Paste Link (YouTube/Vimeo)" 
                        className={inputBaseStyle}
                        />
                        <button onClick={addVideoLink} className="bg-lime-500 text-black px-4 rounded font-bold hover:brightness-110"><Plus size={20}/></button>
                    </div>
                ) : (
                    <div className="text-center cursor-pointer py-4" onClick={() => fileInputRef.current?.click()}>
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 group-hover:text-lime-500 mx-auto mb-2 transition-colors">
                            <Upload size={20} />
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Click to Upload {activeType}</p>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            multiple 
                            accept={activeType === 'image' ? "image/*" : ".pdf,image/*"}
                            onChange={handleFileUpload} 
                        />
                    </div>
                )}
              </div>

              {/* Grid Display */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {images.map(img => (
                      <div key={img.id} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-700">
                          <img src={img.url} className="w-full h-full object-cover" />
                          <button onClick={() => removeMedia(img.id)} className="absolute top-1 right-1 bg-red-500 p-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                      </div>
                  ))}
                  {videos.map(vid => (
                      <div key={vid.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-700 flex flex-col justify-between group">
                          <div className="flex items-center gap-2 text-gray-300 truncate mb-2">
                              <Film size={14} className="text-red-500"/> <span className="text-xs truncate">{vid.url}</span>
                          </div>
                          <button onClick={() => removeMedia(vid.id)} className="self-end text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                  ))}
                  {certificates.map(cert => (
                      <div key={cert.id} className="bg-[#1a1a1a] p-3 rounded-lg border border-gray-700 flex items-center gap-3 relative group">
                          <FileText size={20} className="text-yellow-500"/>
                          <span className="text-xs text-gray-300 truncate">{cert.caption}</span>
                          <button onClick={() => removeMedia(cert.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                      </div>
                  ))}
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
    </div>
  );
};

export default MediaTab;