import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";

/**
 * Chatbot Component: Handles AI construction expert interactions
 */
export default function Chatbot() {
  /* --- States & Hooks --- */
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Load chat history from localStorage on initialization
    const saved = localStorage.getItem("chatbot_messages");
    return saved
      ? JSON.parse(saved)
      : [{ type: "bot", text: "👷‍♂️ مرحبًا! اسألني عن البناء..." }];
  });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("ar");
  const [faq, setFaq] = useState([]); // Dynamic FAQ questions from backend

  /* --- Refs --- */
  const chatbotRef = useRef(null); // Reference for the main container (Draggable)
  const messagesEndRef = useRef(null); // Reference for auto-scrolling
  const offset = useRef({ x: 0, y: 0 }); // Stores mouse offset for dragging

  /* --- Configuration --- */
  const API_URL = "http://localhost:3000/api";
  const USER_ID = "test-user-id";
  const quickQuestions = [
    "كم نسبة خلط الاسمنت؟",
    "What is cement ratio?",
    "كم تكلفة بناء منزل؟",
    "Standard door size?",
  ];

  /* --- Helper Functions --- */
  
  // Detects if text is Arabic or English for UI direction
  const detectLanguage = (value) =>
    /[\u0600-\u06FF]/.test(value) ? "ar" : "en";

  /* --- Side Effects --- */

  // Event listener to open chatbot from global window event
  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-chatbot", openHandler);
    return () => window.removeEventListener("open-chatbot", openHandler);
  }, []);

  // Persists messages to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem("chatbot_messages", JSON.stringify(messages));
  }, [messages]);

  // Keeps message container scrolled to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetches FAQ data from API on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_URL}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: USER_ID }),
        });
        const data = await res.json();
        setFaq(data.questions || []);
      } catch (err) {
        console.error("FAQ fetch error", err);
      }
    };
    fetchQuestions();
  }, []);

  /* --- Chat Handlers --- */

  // Sends user message to AI expert endpoint
  const sendMessage = async (msg = text) => {
    if (!msg.trim() || loading) return;

    const detectedLang = detectLanguage(msg);
    setLang(detectedLang);

    setMessages((prev) => [...prev, { type: "user", text: msg }]);
    setText("");
    setLoading(true);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_URL}/expert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: msg,
          user_id: USER_ID,
          language: detectedLang,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply || "⚠️ No response from server" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Server error or timeout" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handles clicking on predefined FAQ buttons
  const handleFAQClick = async (q) => {
    const questionText = lang === "ar" ? q.question.ar : q.question.en;
    setMessages((prev) => [...prev, { type: "user", text: questionText }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: q.id,
          user_id: USER_ID,
          language: lang,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "❌ Error loading answer" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* --- Dragging Functionality --- */

  const startDrag = (e) => {
    if (!chatbotRef.current) return;
    offset.current = {
      x: e.clientX - chatbotRef.current.offsetLeft,
      y: e.clientY - chatbotRef.current.offsetTop,
    };
    document.onmousemove = drag;
    document.onmouseup = stopDrag;
  };

  const drag = (e) => {
    if (!chatbotRef.current) return;
    chatbotRef.current.style.left = `${e.clientX - offset.current.x}px`;
    chatbotRef.current.style.top = `${e.clientY - offset.current.y}px`;
  };

  const stopDrag = () => {
    document.onmousemove = null;
    document.onmouseup = null;
  };

  // Resets chat history and clears localStorage
  const clearMessages = () => {
    setMessages([{ type: "bot", text: "👷‍♂️ مرحبًا! اسألني عن البناء..." }]);
    localStorage.removeItem("chatbot_messages");
  };

  if (!isOpen) return null;

  /* --- Main UI Render --- */
  return (
    <div
      ref={chatbotRef}
      className="chatbot"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header: Draggable title bar with action buttons */}
      <div className="header" onMouseDown={startDrag}>
        <span>🏗️ AI Construction</span>
        <div className="header-actions">
          <button onClick={clearMessages} title="Clear Chat">🗑️</button>
          <button onClick={() => setIsOpen(false)} title="Close">✖</button>
        </div>
      </div>

      {/* Quick Access: Dynamic FAQ or static fallback buttons */}
      <div className="quick">
        {faq.length > 0
          ? faq.map((q) => (
              <button key={q.id} onClick={() => handleFAQClick(q)}>
                {lang === "ar" ? q.question.ar : q.question.en}
              </button>
            ))
          : quickQuestions.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
      </div>

      {/* Message List: Displays bot and user history */}
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.type}`}>
            {m.text}
          </div>
        ))}

        {/* Loading/Typing Indicator */}
        {loading && (
          <div className="typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area: Text field and send button */}
      <div className="input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={lang === "ar" ? "اكتب سؤالك..." : "Type your question..."}
        />
        <button onClick={() => sendMessage()}>➤</button>
      </div>
    </div>
  );
}
