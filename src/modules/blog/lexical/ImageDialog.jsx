import { useState,useRef  } from "react"; 
import { ImageIcon, X, Upload } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// Image Dialog (URL or file upload)
// ═══════════════════════════════════════════════════════════════════════════════
 const ImageDialog = ({ onInsert, onClose }) => {
  const [tab, setTab]     = useState("url"); // "url" | "upload"
  const [url, setUrl]     = useState("");
  const [alt, setAlt]     = useState("");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objUrl = URL.createObjectURL(file);
    setPreview(objUrl);
    setUrl(objUrl);
  };

  const handleInsert = () => {
    if (!url.trim() && !preview) return;
    onInsert({ src: url || preview, alt });
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-[popIn_0.2s_ease-out]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-bold text-base flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-500" /> Insert Image
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
          {["url", "upload"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all
                ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {t === "url" ? "URL" : "Upload File"}
            </button>
          ))}
        </div>

        {tab === "url" ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Image URL</label>
              <input
                autoFocus
                type="url"
                placeholder="https://example.com/image.jpg"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setPreview(e.target.value); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {preview && (
              <div className="rounded-xl overflow-hidden border border-gray-100 h-36 bg-gray-50 flex items-center justify-center">
                <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" onError={() => setPreview(null)} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3"> 
            <label
              className=" border-2 border-dashed border-gray-200 rounded-xl h-36 cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-blue-500"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="preview" className="max-h-full max-w-full object-contain rounded-xl" />
              ) : (
                <>
                  <Upload size={22} />
                  <span className="text-xs font-medium">Click to upload</span>
                  <span className="text-xs opacity-60">PNG, JPG, WebP, GIF</span>
                </>
              )}
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        )}

        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Alt Text <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            type="text"
            placeholder="Describe the image…"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
          <button
            onClick={handleInsert}
            disabled={!url && !preview}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-40"
          >
            Insert Image
          </button>
        </div>
      </div>
      <style>{`
        @keyframes popIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
      `}</style>
    </div>
  );
}
export default ImageDialog;