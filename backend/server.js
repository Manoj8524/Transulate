require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENAI_API_KEY;
const BASE_URL = process.env.BASE_URL;

app.post("/translate", async (req, res) => {
  try {
    const { text, type } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    let prompt;
    if (type === "tanglish-to-english") {
      prompt = `Translate this Tanglish to English: ${text}`;
    } else if (type === "english-to-tanglish") {
      prompt = `Translate this English sentence to Tanglish (Tamil in Roman script): ${text}`;
    } else if (type === "tamil-to-english") {
      prompt = `Translate this Tamil text to English: ${text}`;
    } else {
      return res.status(400).json({ error: "Invalid translation type" });
    }

    const response = await axios.post(
      `${BASE_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
      }
    );

    res.json({ translation: response.data.choices[0].message.content.trim() });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
