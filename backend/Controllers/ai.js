const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
    try {
        console.log("AI Chat Request Received");

        // Debug Logging
        if (process.env.GEMINI_API_KEY) {
            console.log("API Key Present: Yes (Length: " + process.env.GEMINI_API_KEY.length + ")");
            console.log("API Key Start: " + process.env.GEMINI_API_KEY.substring(0, 4) + "...");
        } else {
            console.error("API Key Present: NO - Environment Variable Missing");
        }

        console.log("Request Body:", JSON.stringify(req.body));
        const { message } = req.body;

        if (!message) {
            console.error("No message provided in body");
            return res.status(400).json({ error: "Message is required" });
        }

        // Check for API Key
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your gemini api") {
            console.error("Critical: GEMINI_API_KEY is not configured properly.");
            return res.status(500).json({
                error: "Chatbot not configured. Please add a valid Gemini API key.",
                details: "Get your free API key from https://aistudio.google.com/app/apikey"
            });
        }

        // Trim key to remove accidental spaces
        const API_KEY = process.env.GEMINI_API_KEY.trim();
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Shortened system instruction to reduce token usage
        const systemInstruction = `You are a Gym Assistant for Fitby. Help admins manage members, expenses, and memberships. Be concise.`;

        // Try multiple models in order of preference
        const modelsToTry = [
            "gemini-2.0-flash-exp",
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-pro"
        ];

        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`Attempting to use model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 150, // Reduced from 1000 to save tokens
                    }
                });

                const chat = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: systemInstruction }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Understood. I am ready to assist the Fitby Admin." }],
                        },
                    ],
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                const text = response.text();

                console.log(`✅ AI Response Success from model: ${modelName}`);
                return res.status(200).json({ reply: text });

            } catch (e) {
                console.log(`❌ Model ${modelName} failed:`, e.message);
                lastError = e;

                // If it's a 404 (model not found), try next model
                if (e.message.includes("404") || e.message.includes("not found")) {
                    continue;
                }

                // If it's an API key error, stop trying
                if (e.message.includes("API_KEY") || e.message.includes("401") || e.message.includes("403")) {
                    return res.status(401).json({
                        error: "Invalid API Key",
                        details: "Please check your Gemini API key configuration."
                    });
                }

                // If it's a rate limit, inform user
                if (e.message.includes("429")) {
                    return res.status(429).json({
                        error: "AI Rate Limit Exceeded",
                        details: "Please try again in a few moments."
                    });
                }

                // For other errors, try next model
                continue;
            }
        }

        // If all models failed
        console.error("All models failed. Last error:", lastError?.message);
        return res.status(500).json({
            error: "AI Service Temporarily Unavailable",
            details: lastError?.message || "Please try again later.",
            suggestion: "Check your internet connection and API key validity."
        });

    } catch (error) {
        console.error("AI Chat Critical Error (Wrapper):", error);
        res.status(500).json({
            error: "Internal Server Error during AI Chat.",
            details: error.message
        });
    }
};
