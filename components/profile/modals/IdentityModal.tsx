import React from "react";
import { X, ShieldCheck, FileText } from "lucide-react";
import { IdentityFile } from "../CreateProfile";

const IdentityModal = ({ isOpen, onClose, file }: { isOpen: boolean; onClose: () => void; file: IdentityFile | null }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#121212]">
          <h3 className="text-lime-500 font-bold uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={18}/> Identity Proof Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="flex-1 bg-[#0a0a0a] p-4 flex items-center justify-center overflow-auto relative">
           {file ? (file.type.startsWith("image/") ? <img src={file.url} className="max-w-full max-h-full object-contain" /> : file.type === "application/pdf" ? <iframe src={file.url} className="w-full h-full border-0" title="PDF Preview"></iframe> : <div className="text-center text-gray-400"><FileText size={48} className="mx-auto mb-2 opacity-50"/><p>Preview not available</p></div>) : <p className="text-gray-500">No document selected</p>}
        </div>
        <div className="p-4 border-t border-gray-700 bg-[#121212] flex justify-between items-center"><span className="text-xs text-gray-400 truncate max-w-[300px]">{file?.name}</span><button onClick={onClose} className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600">Close</button></div>
      </div>
    </div>
  );
};
export default IdentityModal;