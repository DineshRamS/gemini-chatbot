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
  `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`
,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }]
    })
  }
);


    const rawText = await response.text();
    console.log("📨 Raw Gemini response:", rawText);

    if (!response.ok || !rawText) {
      console.error(`❌ Gemini API returned status ${response.status}`);
      return res.status(500).json({ reply: `Gemini: API error: ${response.status} empty response` });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseError) {
      console.error("❌ Failed to parse Gemini response:", parseError);
      return res.status(500).json({ reply: "Invalid response from Gemini API" });
    }

    // Extract reply from parsed data
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    res.status(500).json({ reply: "Server error occurred" });
  }
});

// ✅ Start the server
app.listen(10000, () => {
  console.log("✅ Server running on port 10000");
});
