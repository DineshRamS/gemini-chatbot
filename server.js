const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_KEY = process.env.GEMINI_API_KEY;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ POST route to handle chatbot messages
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("📩 Incoming message:", userMessage);

    if (!API_KEY) {
      console.error("❌ Missing Gemini API key");
      return res.status(500).json({ reply: "Server misconfigured: missing API key" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta1/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        })
      }
    );

    const rawText = await response.text(); // Get raw response
    console.log("📨 Raw Gemini response:", rawText);

    if (!response.ok) {
      console.error(`❌ Gemini API returned status ${response.status}`);
      return res.status(500).json({ reply: "Gemini API error" });
    }

    const data = JSON.parse(rawText); // Now safely parse
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini did not return a valid reply";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in Gemini API call:", error);
    res.status(500).json({ reply: "Error fetching response" });
  }
});
