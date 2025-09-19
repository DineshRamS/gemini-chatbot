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

    const data = await response.json();
    console.log("📨 Gemini response:", JSON.stringify(data, null, 2));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini did not return a valid reply";
    res.json({ reply });

  } catch (error) {
    console.error("❌ Error in Gemini API call:", error);
    res.status(500).json({ reply: "Error fetching response" });
  }
});

// ✅ Use dynamic port for Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
