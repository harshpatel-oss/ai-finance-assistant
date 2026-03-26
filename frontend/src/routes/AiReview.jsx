import React, { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";

const AiReview = () => {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { type: "user", text: query };
    setChat((prev) => [...prev, userMsg]);

    setLoading(true);
    setQuery("");

    try {
      const res = await axiosInstance.post(API_PATHS.AI.AI_ASSISTANT, {
        query,
      });

      console.log("FULL RESPONSE:", res);

      const aiText =
        res?.data?.response ||
        res?.data?.text ||
        "⚠️ Empty response from server";

      setChat((prev) => [
        ...prev,
        { type: "ai", text: aiText.trim() },
      ]);

    } catch (err) {
      console.error("ERROR:", err);

      if (err?.type === "AUTH_ERROR" || err?.response?.status === 401) {
        setChat((prev) => [
          ...prev,
          {
            type: "ai",
            text: "🔒 Login for personalized insights (general AI still works)",
          },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { type: "ai", text: "⚠️ Failed to fetch response" },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[90vh] flex flex-col p-4">
      <h1 className="text-xl font-bold text-center mb-3">AI Assistant</h1>

      <div className="flex-1 overflow-y-auto space-y-3 bg-gray-50 p-3 rounded">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[75%] text-sm shadow ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                {msg.text}
              </pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500 animate-pulse">
            Thinking...
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form onSubmit={sendMessage} className="flex mt-2 gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Ask anything..."
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AiReview;