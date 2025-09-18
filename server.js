const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = "AIzaSyA4gMBDy_V5l7GH7S8PzHnRplh3mDJ60nA"; // 🔐 Replace with your real key

app.post("/chat", async (req, res) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in Gemini API call:", error);
    res.status(500).json({ reply: "Error fetching response" });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
