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
  }, [chat]);

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

      const aiMsg = {
        type: "ai",
        text: res.data.response || "No response",
      };

      setChat((prev) => [...prev, aiMsg]);

    } catch (err) {
      setChat((prev) => [
        ...prev,
        { type: "ai", text: "Error fetching response" },
      ]);
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
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`p-3 rounded max-w-[75%] whitespace-pre-wrap ${
                msg.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text.split("\n").map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          </div>
        ))}

        {loading && <p className="text-sm text-gray-500">Thinking...</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={sendMessage} className="flex mt-2 gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Ask anything..."
        />
        <button className="bg-green-500 text-white px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default AiReview;