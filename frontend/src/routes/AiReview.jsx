import React, { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance.js";
import { API_PATHS } from "../utils/apiPaths.js";
import { Send, Sparkles, Copy, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";
import { useToast, ToastContainer } from "../components/ui/Toast";

const AiReview = () => {
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef();
  const { toasts, showToast } = useToast();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { type: "user", text: query, timestamp: new Date() };
    setChat((prev) => [...prev, userMsg]);

    setLoading(true);
    setQuery("");

    try {
      const res = await axiosInstance.post(API_PATHS.AI.AI_ASSISTANT, {
        query,
      });

      const aiText =
        res?.data?.response ||
        res?.data?.text ||
        "I encountered an issue processing your request. Please try again.";

      setChat((prev) => [
        ...prev,
        { type: "ai", text: aiText.trim(), timestamp: new Date() },
      ]);

    } catch (err) {
      console.error("AI Error:", err);

      let errorMessage = "Failed to get AI response. Please try again.";
      
      if (err?.type === "AUTH_ERROR" || err?.response?.status === 401) {
        errorMessage = "Session expired. Please log in again for personalized insights.";
      }

      setChat((prev) => [
        ...prev,
        { type: "ai", text: errorMessage, timestamp: new Date(), isError: true },
      ]);
      
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      setChat([]);
      showToast("Chat cleared", "success");
    }
  };

  const suggestedQuestions = [
    "What's my average daily expense?",
    "How can I save more money?",
    "Analyze my spending patterns",
    "Budget recommendations",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-600">Financial insights powered by AI</p>
            </div>
          </div>
          {chat.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto">
          {chat.length === 0 ? (
            // Empty State
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="text-center mb-8">
                <div className="inline-block p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-6">
                  <Sparkles size={48} className="text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Start a Conversation
                </h2>
                <p className="text-gray-600 max-w-md">
                  Ask me questions about your finances, budgeting tips, expense analysis, and more!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(question);
                      setTimeout(() => {
                        document.querySelector('form')?.dispatchEvent(
                          new Event('submit', { bubbles: true })
                        );
                      }, 100);
                    }}
                    className="p-4 text-left rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                  >
                    <p className="font-medium text-gray-900 group-hover:text-indigo-600">
                      {question}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Click to ask</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="space-y-4">
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  {msg.type === "user" ? (
                    // User Message
                    <div className="max-w-2xl">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl rounded-tr-none px-6 py-4 shadow-lg">
                        <p className="text-base leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    // AI Message
                    <div className="max-w-3xl w-full">
                      <Card className="border-2 border-gray-100 bg-white shadow-md">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex-shrink-0">
                              <Sparkles size={20} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              {msg.isError ? (
                                <p className="text-red-600 font-medium">{msg.text}</p>
                              ) : (
                                <div className="prose prose-sm max-w-none">
                                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {msg.text}
                                  </p>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => copyToClipboard(msg.text)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                              title="Copy message"
                            >
                              <Copy size={18} className="text-gray-500 hover:text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <Card className="max-w-3xl w-full border-2 border-gray-100 bg-white shadow-md">
                    <div className="p-6 flex items-center gap-4">
                      <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                        <Loader size="sm" />
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "100ms" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }} />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 md:px-8 py-6 shadow-lg sticky bottom-0">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={sendMessage} className="flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your finances, budgeting, spending patterns..."
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white placeholder-gray-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
            />
            <Button
              type="submit"
              disabled={loading || !query.trim()}
              className="rounded-2xl px-6 flex items-center gap-2 whitespace-nowrap"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-3 text-center">
            AI Assistant can help you analyze spending, budget planning, and financial insights
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default AiReview;