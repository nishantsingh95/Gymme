const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const fs = require('fs');

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("No API Key found");
        return;
    }
    const cleanKey = key.trim();

    try {
        console.log("Fetching models...");
        // Using native fetch for direct API inspection
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);

        if (!response.ok) {
            fs.writeFileSync("available_models.txt", `Error: ${response.status} - ${response.statusText}\n${await response.text()}`);
            console.log("Fetch failed. See available_models.txt");
        } else {
            const data = await response.json();
            let output = "AVAILABLE MODELS:\n";
            if (data.models) {
                data.models.forEach(m => {
                    output += `- ${m.name} (Supported: ${m.supportedGenerationMethods.join(', ')})\n`;
                });
            } else {
                output += "No models array in response.\n";
                output += JSON.stringify(data, null, 2);
            }
            fs.writeFileSync("available_models.txt", output);
            console.log("Success! Models written to available_models.txt");
        }

    } catch (error) {
        fs.writeFileSync("available_models.txt", `Exception: ${error.message}`);
        console.error("Exception:", error.message);
    }
}

listModels();
