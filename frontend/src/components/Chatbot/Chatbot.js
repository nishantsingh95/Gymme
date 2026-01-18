import React, { useState, useEffect, useRef } from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hello Admin! 👋 I am your Gym Assistant. How can I help you manage the gym today?",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Cooldown timer
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || cooldown > 0) return;

        const userMessage = { role: "user", text: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);
        setCooldown(10); // 10 second cooldown

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/ai/chat`, {
                message: inputValue,
            });

            const botMessage = { role: "bot", text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            const serverMsg = error.response?.data?.error;
            const details = error.response?.data?.details;

            let errorText = serverMsg || "Sorry, I am having trouble connecting.";

            // Add helpful message for rate limit errors
            if (serverMsg?.includes("Rate Limit")) {
                errorText += " Please wait a moment before sending another message.";
            } else if (details) {
                errorText += ` (${details})`;
            }

            const errorMessage = {
                role: "bot",
                text: errorText,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && cooldown === 0) handleSendMessage();
    };

    return (
        <div className="fixed bottom-10 left-10 z-50 flex flex-col items-start gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[320px] h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1 rounded-full">
                                <SmartToyIcon />
                            </div>
                            <div className="font-semibold">Gym Assistant</div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 p-1 rounded-full transition-colors"
                        >
                            <CloseIcon fontSize="small" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-indigo-600 text-white self-end rounded-br-none"
                                    : "bg-white text-gray-800 self-start rounded-bl-none border border-gray-100"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-white text-gray-500 self-start p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm text-sm italic">
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2">
                        {cooldown > 0 && (
                            <div className="text-xs text-center text-amber-600 bg-amber-50 py-1 px-2 rounded-full">
                                ⏱️ Please wait {cooldown}s before next message
                            </div>
                        )}
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={cooldown > 0 ? `Wait ${cooldown}s...` : "Ask me anything..."}
                                disabled={cooldown > 0}
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-700 disabled:opacity-50"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim() || cooldown > 0}
                                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <SendIcon fontSize="small" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
                >
                    <SupportAgentIcon fontSize="medium" className="animate-pulse" />
                    <span className="absolute left-full ml-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Need Help?
                    </span>
                </button>
            )}
        </div>
    );
};

export default Chatbot;
