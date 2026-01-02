const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Key length:", key ? key.length : 0);

    try {
        // Try native fetch first
        console.log("Fetching available models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            console.log(`Fetch Status: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log("Error Body:", text);
        } else {
            const data = await response.json();
            console.log("--- AVAILABLE MODELS ---");
            if (data.models) {
                data.models.forEach(m => console.log(m.name));
            } else {
                console.log("No models found in response:", data);
            }
        }

    } catch (error) {
        console.error("Fetch failed (Node version might be old):", error.message);
    }
}

listModels();
