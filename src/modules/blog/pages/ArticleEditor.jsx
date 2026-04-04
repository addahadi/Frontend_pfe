import React, { useRef,useState} from 'react';

import { 
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, 
  Type, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, Palette ,Save ,Globe
} from 'lucide-react';



const ArticleEditor = () => {  
  const [coverImage, setCoverImage] = useState(null); 
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl);
  }
};
const editorRef = useRef(null);
  const [activeStyles, setActiveStyles] = useState({});

  // 1. Function to execute commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    checkActiveStyles(); // Update UI immediately
    editorRef.current.focus();
  };

  // 2. Effect to track active styles based on cursor position
  const checkActiveStyles = () => {
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    });
  };

  const handleImageUpload = () => {
    const url = prompt("Enter the image URL:");
    if (url) execCommand('insertImage', url);
  };

  // Helper for button styling
  const btnClass = (isActive) => `
    p-2 rounded transition-colors duration-200 
    ${isActive ? 'bg-blue-100 text-blue-600 shadow-sm' : 'hover:bg-gray-200 text-gray-600'}
  `;

  /*this takes the text and replace spaces with "-" for the slug*/
      const [text, setText] = useState("");    
      const formattedText = text.trim().replace(/\s+/g, "-"); 


    const [type, setType] = useState("BLOG");
  const [status, setStatus] = useState("DRAFT"); 
  
//button
const baseBtn = "px-6 py-2 text-sm  transition-all duration-200  border-2 rounded-lg";

return (
    // We make the outer container the scrollable one
    <div className=" bg-gray-50 overflow-y-auto overflow-x-hidden">
      
      {/* max-w-7xl: Limits width on huge screens
        mx-auto: Centers the content
        px-4 sm:px-6 lg:px-8: Responsive padding for the sides
      */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column (Inputs & Editor) */}
          <div className="lg:col-span-2 space-y-6">  

            <div>
              <h3 className="mb-1 font-medium text-gray-700">Title</h3>
              <input 
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter title..." 
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div> 

            <div>
              <h3 className="mb-1 font-medium text-gray-700">Slug <span className="text-sm font-normal text-gray-400">(auto-generated)</span></h3>           
              <input
                type="text"
                value={formattedText}
                className="w-full border border-gray-100 rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                placeholder="Slug"
                disabled 
              />
            </div> 

            <div>
              <h3 className="mb-1 font-medium text-gray-700">Excerpt</h3>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Short summary of the article..."
              />
            </div>

            {/* Rich Text Editor */}
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {/* ... Your Toolbar Code ... */}
              <div 
                className="flex flex-wrap items-center gap-1 border-b p-2 bg-gray-50"
                onMouseUp={checkActiveStyles}
                onKeyUp={checkActiveStyles}
              >
                <select 
                  onChange={(e) => execCommand('fontName', e.target.value)}
                  className="bg-transparent text-sm border-none outline-none cursor-pointer hover:bg-gray-200 p-1 rounded"
                >
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Monospace</option> 
                </select>

                <select 
                  onChange={(e) => execCommand('fontSize', e.target.value)}
                  className="bg-transparent text-sm border-none outline-none cursor-pointer hover:bg-gray-200 p-1 rounded"
                >
                  <option value="3">Normal</option>
                  <option value="1">Small</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <button onClick={() => execCommand('bold')} className={btnClass(activeStyles.bold)}>
                  <Bold size={18} />
                </button>
                <button onClick={() => execCommand('italic')} className={btnClass(activeStyles.italic)}>
                  <Italic size={18} />
                </button>
                <button onClick={() => execCommand('underline')} className={btnClass(activeStyles.underline)}>
                  <Underline size={18} />
                </button>
                <button onClick={() => execCommand('strikeThrough')} className={btnClass(activeStyles.strikeThrough)}>
                  <Strikethrough size={18} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <div className="relative group">
                  <button className={btnClass(false)}>
                    <Palette size={18} />
                    <input 
                      type="color" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => execCommand('foreColor', e.target.value)}
                    />
                  </button>
                </div>

                <button onClick={() => execCommand('justifyLeft')} className={btnClass(false)}>
                  <AlignLeft size={18} />
                </button>
                <button onClick={() => execCommand('justifyCenter')} className={btnClass(false)}>
                  <AlignCenter size={18} />
                </button>
                <button onClick={() => execCommand('justifyRight')} className={btnClass(false)}>
                  <AlignRight size={18} />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                <button onClick={() => execCommand('insertUnorderedList')} className={btnClass(activeStyles.unorderedList)}>
                  <List size={18} />
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className={btnClass(activeStyles.orderedList)}>
                  <ListOrdered size={18} />
                </button>
                <button onClick={handleImageUpload} className={btnClass(false)}>
                  <ImageIcon size={18} />
                </button>
              </div>

              <div
                ref={editorRef}
                contentEditable
                onKeyUp={checkActiveStyles}
                onMouseUp={checkActiveStyles}
                className="min-h-[400px] p-4 outline-none prose prose-sm max-w-none overflow-hidden"
                placeholder="Start writing..."
              ></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition duration-200 hover:bg-blue-700 active:scale-95 shadow-md shadow-blue-100">
                <Save size={18} />
                Save Article
              </button> 

              <button className="flex items-center gap-2 border-2 border-green-500 text-green-600 px-6 py-2 rounded-lg font-medium transition duration-200 hover:bg-green-50 active:scale-95">
                <Globe size={18} />
                Save & Publish
              </button> 

              <button className="flex items-center gap-2 text-gray-500 px-6 py-2 rounded-lg font-medium transition duration-200 hover:bg-gray-100 active:scale-95">
                Cancel
              </button>
            </div>
          </div>

          {/* Right Column (Sidebar/Metadata) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className=" text-gray-800  pb-2">METADATA</h3>

              <div>
                <h4 className="text-gray-400 mb-3 text-xs font-bold uppercase tracking-wider">Type</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setType("BLOG")}
                    className={`${baseBtn} ${type === "BLOG" ? "border-blue-200 bg-blue-50 text-blue-700 " : "border-gray-100 bg-white text-gray-400"}`}
                  >
                    BLOG
                  </button>
                  <button
                    onClick={() => setType("ACTUALITE")}
                    className={`${baseBtn} ${type === "ACTUALITE" ? "border-blue-200 bg-blue-50 text-blue-700 " : "border-gray-100 bg-white text-gray-400"}`}
                  >
                    ACTUALITE
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-gray-400 mb-3 text-xs font-bold uppercase tracking-wider">Status</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus("DRAFT")}
                    className={`${baseBtn} ${status === "DRAFT" ? "bg-yellow-50 text-yellow-700 border-yellow-200 " : "border-gray-100 bg-white text-gray-400"}`}
                  >
                    DRAFT
                  </button>
                  <button
                    onClick={() => setStatus("PUBLISHED")}
                    className={`${baseBtn} ${status === "PUBLISHED" ? "bg-green-50 text-green-700 border-green-200 " : "border-gray-100 bg-white text-gray-400"}`}
                  >
                    PUBLISHED
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className=" text-gray-800 mb-4">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {["Béton armé", "Fondations"].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs font-semibold border border-gray-100">
                  Isolation
                </span>
              </div>
            </div>

<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
  <h3 className="font-bold text-gray-800 mb-4">COVER IMAGE</h3>

  {/* Hidden input */}
  <input
    type="file"
    accept="image/*"
    id="cover-upload"
    className="hidden"
    onChange={handleImageChange}
  />

  {/* Clickable upload box */}
  <label
    htmlFor="cover-upload"
    className="border-2 border-dashed border-gray-200 h-32 flex flex-col items-center justify-center text-gray-400 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors overflow-hidden"
  >
    {coverImage ? (
      <img
        src={coverImage}
        alt="Cover"
        className="w-full h-full object-cover rounded-lg"
      />
    ) : (
      <>
        <ImageIcon size={24} className="mb-2" />
        <span className="text-sm">Upload Photo</span>
      </>
    )}
  </label>
</div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
