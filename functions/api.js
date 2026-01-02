const serverless = require("serverless-http");
const app = require("../backend/index"); // Adjust path as needed based on where functions/ folder is relative to backend

// Netlify Functions lookup usually from root. 
// If I create Gymme/functions/api.js
// And Gymme/backend/index.js exists
// Then path is ../backend/index

module.exports.handler = serverless(app);
