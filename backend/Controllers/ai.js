const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
    try {
        console.log("AI Chat Request Received");

        // Debug Logging
        if (process.env.GEMINI_API_KEY) {
            console.log("API Key Present: Yes (Length: " + process.env.GEMINI_API_KEY.length + ")");
            // Log first 4 chars for verification without exposing full key
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
        if (!process.env.GEMINI_API_KEY) {
            console.error("Critical: GEMINI_API_KEY is undefined on the server.");
            return res.status(500).json({ error: "API Key not configured on server (Check Netlify Env Vars)." });
        }

        // Trim key to remove accidental spaces
        const API_KEY = process.env.GEMINI_API_KEY.trim();
        const genAI = new GoogleGenerativeAI(API_KEY);

        const systemInstruction = `
    You are an expert Admin Support Agent for 'Fitby' Gym Management System.
    Your goal is to help the gym admin manage their gym effectively using this software.
    
    Here is the knowledge base of the system features:
    1. **Dashboard**: Shows total members, expenses, and quick stats (Joined, Expiring).
    2. **Sidebar**: Navigation to Dashboard, Members, Logout. Shows Username and 'admin' role.
    3. **Members**:
       - **Add Member**: Use the "+" button -> "Add Member". Requires Name, Mobile, Slot Timing (Morning/Evening/etc.).
       - **View Members**: Go to "Members" page. Shows list with Status (Active/Inactive).
       - **Delete Member**: Click on a member -> Click "Delete" button (Red). Confirms before deleting.
       - **Renew Membership**: Click on a member -> "Renew" section. You can select a custom "Joining Date" (Start Date) for the renewal. If not selected, it defaults to today.
       - **Slot Timing**: Displayed on member cards and details. Defaults to "Not Set" if missing.
    4. **Expenses**:
       - **Add Expense**: Use the "+" button -> "Add Expenses". Beautiful modern form.
       - **View Expenses**: Dashboard -> Click "Total Expenses" card. resized for better view.
    5. **Authentication**: Login requires Username and Password.
    
    **Rules**:
    - Be helpful, concise, and professional.
    - If the user asks how to do something, give step-by-step instructions based on the features above.
    - If you don't know, say "I am not sure about that specific feature, but you can check the Dashboard."
    `;

        // Single reliable model to prevent quota exhaustion from retries
        const modelName = "gemini-1.5-flash";

        try {
            console.log(`Attempting to use model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

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

            // Test the model with the actual message to ensure it works
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();

            console.log("AI Response Success from model:", modelName);

            // If successful, send response and exit function
            return res.status(200).json({ reply: text });

        } catch (e) {
            console.log(`Model ${modelName} failed:`, e.message);

            const status = e.message.includes("429") ? 429 : 500;
            const errorMessage = status === 429
                ? "AI Rate Limit Exceeded. Please try again later."
                : "AI Service Unavailable. Please check Admin Logs.";

            res.status(status).json({
                error: errorMessage,
                details: e.message
            });
        }



    } catch (error) {
        console.error("AI Chat Critical Error (Wrapper):", error);
        res.status(500).json({ error: "Internal Server Error during AI Chat." });
    }
};
