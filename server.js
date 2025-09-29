const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 🔐 Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY is missing. Check your .env file.");
  process.exit(1);
}

const app = express();

// 🛡️ Middleware
app.use(cors());
app.use(express.json()); // ✅ Required to parse JSON bodies

// 🤖 Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 📡 POST endpoint for chatbot
app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt must be a non-empty string." });
  }

  try {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    apiVersion: "v1"
  });

  const result = await model.generateContent(req.body.prompt);
  const response = await result.response;
  const text = response.text();

  res.status(200).json({ reply: text });
} catch (error) {
  console.error("🔥 Gemini API error:", error.message);
  console.error("📦 Full error object:", error);
  res.status(500).json({ error: error.message || "Unknown error" });
}

});

// 🌐 Health check route
app.get("/", (req, res) => {
  res.send("✅ Gemini Chatbot backend is running.");
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
