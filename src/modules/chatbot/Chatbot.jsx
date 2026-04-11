import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatbot_messages");
    return saved
      ? JSON.parse(saved)
      : [{ type: "bot", text: "👷‍♂️ مرحبًا! اسألني عن البناء..." }];
  });
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("ar");

  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const API_URL = "http://localhost:3000/api";

  const quickQuestions = [
    "كم نسبة خلط الاسمنت؟",
    "What is cement ratio?",
    "كم تكلفة بناء منزل؟",
    "Standard door size?",
  ];

  // 🧠 كشف اللغة
  const detectLanguage = (value) =>
    /[\u0600-\u06FF]/.test(value) ? "ar" : "en";

  // 📡 استقبال event من Layout
  useEffect(() => {
    const openHandler = () => setIsOpen(true);
    window.addEventListener("open-chatbot", openHandler);

    return () => {
      window.removeEventListener("open-chatbot", openHandler);
    };
  }, []);

  // 💾 حفظ الرسائل
  useEffect(() => {
    localStorage.setItem("chatbot_messages", JSON.stringify(messages));
  }, [messages]);

  // 📜 auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // 🚀 إرسال الرسالة
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: msg,
          user_id: "guest",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.reply || "⚠️ No response from server",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "❌ Server error or timeout",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🖱️ Drag
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

  // 🧹 مسح المحادثة
  const clearMessages = () => {
    const initial = [
      { type: "bot", text: "👷‍♂️ مرحبًا! اسألني عن البناء..." },
    ];
    setMessages(initial);
    localStorage.removeItem("chatbot_messages");
  };

  // ❌ إذا مغلق لا يظهر
  if (!isOpen) return null;

  return (
    <div
      ref={chatbotRef}
      className="chatbot"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="header" onMouseDown={startDrag}>
        <span>🏗️ AI Construction</span>

        <div className="header-actions">
          <button onClick={clearMessages} title="Clear">
            🗑️
          </button>
          <button onClick={() => setIsOpen(false)}>✖</button>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="quick">
        {quickQuestions.map((q, i) => (
          <button key={i} onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.type}`}>
            {m.text}
          </div>
        ))}

        {loading && (
          <div className="typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            lang === "ar"
              ? "اكتب سؤالك..."
              : "Type your question..."
          }
        />
        <button onClick={() => sendMessage()}>➤</button>
      </div>
    </div>
  );
}
