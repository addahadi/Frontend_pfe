import React, { useRef,useState} from 'react';
import { Bold, Italic, Underline, List, ListOrdered ,Save ,Globe  } from 'lucide-react';



const ArticleEditor = () => {  
  const editorRef = useRef(null); 

  /*this takes the text and replace spaces with "-" for the slug*/
      const [text, setText] = useState("");    
      const formattedText = text.trim().replace(/\s+/g, "-"); 

  const format = (cmd) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, null);
  }; 
    const [type, setType] = useState("BLOG");
  const [status, setStatus] = useState("DRAFT");

  const baseBtn =
    "px-4 py-2 rounded-lg text-sm font-medium transition";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-4">  

            <div>
              <h3 className="mb-1 text-gray-700">Title</h3>
              <input 
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Title" 
                value={text}
                onChange={(e) => setText(e.target.value)}

              />
            </div> 

            <div>
              <h3 className="mb-1 text-gray-700">Slug</h3>           
            <input
              type="text"
              value={formattedText}
              className="w-full border rounded-lg px-3 py-2 bg-gray-100"
              placeholder="Slug"
              disabled 
            />
            </div> 

            <div>
              <h3 className="mb-1 text-gray-700">Excerpt</h3>
            <textarea
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Excerpt"
            />
            </div>

            {/* Editor */}
            <div className="border rounded-lg">
              {/* Toolbar */}
              <div className="flex gap-2 border-b p-2 bg-gray-100">
                <button onClick={() => format('bold')}><Bold size={18} /></button>
                <button onClick={() => format('italic')}><Italic size={18} /></button>
                <button onClick={() => format('underline')}><Underline size={18} /></button>
                <button onClick={() => format('insertUnorderedList')}><List size={18} /></button>
                <button onClick={() => format('insertOrderedList')}><ListOrdered size={18} /></button>
              </div>

              {/* Editable Area */}
              <div
                ref={editorRef}
                contentEditable
                className="min-h-[200px] p-3 outline-none"
              ></div>
            </div>

            {/* Buttons */}
<div className="flex gap-4">
  
  {/* Save */}
  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg 
  transition duration-200 hover:bg-blue-700 active:scale-95">
    <Save size={18} />
    Save Article
  </button> 

  {/* Publish */}
  <button className="flex items-center gap-2 border border-green-500 text-green-600 px-4 py-2 rounded-lg 
  transition duration-200 hover:bg-green-50 active:scale-95">
    <Globe size={18} />
    Save & Publish
  </button> 

  {/* Cancel */}
  <button className="flex items-center gap-2 text-blue-600 px-4 py-2 rounded-lg font-semibold 
  transition duration-200 hover:bg-blue-50 active:scale-95">
    Cancel
  </button>

</div>
          </div>

          {/* Right */}
 <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border space-y-6">
        <h3 className="font-semibold">METADATA</h3>

        {/* TYPE */}
        <div>
          <h4 className="text-gray-500 mb-2 text-sm">Type</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setType("BLOG")}
              className={`${baseBtn} ${
                type === "BLOG"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100"
              }`}
            >
              BLOG
            </button>

            <button
              onClick={() => setType("ACTUALITE")}
              className={`${baseBtn} ${
                type === "ACTUALITE"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100"
              }`}
            >
              ACTUALITE
            </button>
          </div>
        </div>

        {/* STATUS */}
        <div>
          <h4 className="text-gray-500 mb-2 text-sm">Status</h4>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("DRAFT")}
              className={`${baseBtn} ${
                status === "DRAFT"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100"
              }`}
            >
              DRAFT
            </button>

            <button
              onClick={() => setStatus("PUBLISHED")}
              className={`${baseBtn} ${
                status === "PUBLISHED"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100"
              }`}
            >
              PUBLISHED
            </button>
          </div>
        </div>
      </div>

      {/* TAGS */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-semibold mb-3">TAGS</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            Béton armé
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
            Fondations
          </span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            Isolation
          </span>
        </div>
      </div>

      {/* COVER IMAGE */}
      <div className="bg-white p-4 rounded-xl border">
        <h3 className="font-semibold mb-3">COVER IMAGE</h3>
        <div className="border-2 border-dashed h-32 flex items-center justify-center text-gray-400 rounded-lg">
          Upload
        </div>
      </div>
    </div>

        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;
