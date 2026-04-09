import React, { useState, useRef, useEffect } from "react";
import "./chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "👷‍♂️ مرحبًا! اسألني عن البناء..." },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("ar");

  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const quickQuestions = [
    "كم نسبة خلط الاسمنت؟",
    "What is cement ratio?",
    "كم تكلفة بناء منزل؟",
    "Standard door size?",
  ];

  const detectLanguage = (value) =>
    /[\u0600-\u06FF]/.test(value) ? "ar" : "en";

  const sendMessage = async (msg = text) => {
    if (!msg.trim() || loading) return;

    const detectedLang = detectLanguage(msg);
    setLang(detectedLang);

    setMessages((prev) => [...prev, { type: "user", text: msg }]);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/expert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_message: msg,
          user_id: "guest",
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.reply || "No response received.",
          },
        ]);
        setLoading(false);
      }, 700);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "❌ Error connecting to server",
        },
      ]);
      setLoading(false);
    }
  };

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

  const clearMessages = () => {
    setMessages([
      { type: "bot", text: "👷‍♂️ مرحبًا! اسألني عن البناء..." },
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div
      ref={chatbotRef}
      className="chatbot"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="header" onMouseDown={startDrag}>
        <span>🏗️ AI Construction</span>
        <button
          className="clear-btn"
          onClick={clearMessages}
          title="Clear chat"
        >
          🗑️
        </button>
      </div>

      {/* Quick Questions */}
      <div className="quick">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => sendMessage(question)}
          >
            {question}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`msg ${message.type}`}
          >
            {message.text}
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
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
          placeholder={
            lang === "ar"
              ? "اكتب سؤالك..."
              : "Type your question..."
          }
        />

        <button onClick={() => sendMessage()}>
          ➤
        </button>
      </div>
    </div>
  );
}
