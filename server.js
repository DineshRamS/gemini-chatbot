const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

console.log("📄 Looking for .env at:", path.resolve(__dirname, ".env"));
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("🔑 Loaded API key:", process.env.GOOGLE_API_KEY);
console.log("📁 Current directory:", __dirname);

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/api/gemini", async (req, res) => {
  const { prompt } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const response = await result.response;
    const text = response.text();

    res.send({ reply: text });
  } catch (error) {
    console.error("🔥 Gemini API error:", error.message);
    console.error("📦 Full error:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
