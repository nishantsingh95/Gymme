const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // Check for API Key
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API Key not configured on server." });
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

        // List of models to try in order of preference
        const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro", "gemini-2.0-flash-exp"];

        let chatSession = null;
        let modelNameUsed = "";
        let lastError = null;

        // Iterate through models until one works
        for (const modelName of modelsToTry) {
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

                // If successful, send response and exit function
                return res.status(200).json({ reply: text });

            } catch (e) {
                console.log(`Model ${modelName} failed:`, e.message);
                lastError = e;
                // Continue to next model
            }
        }

        // If all models fail
        console.error("All AI models failed.");
        res.status(500).json({
            error: "AI Service Unavailable. Please check your API Key permissions or try again later.",
            details: lastError ? lastError.message : "No models available"
        });

    } catch (error) {
        console.error("AI Chat Critical Error:", error);
        res.status(500).json({ error: "Internal Server Error during AI Chat." });
    }
};
