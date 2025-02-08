import React, { useState } from "react";
import axios from "axios";

function App() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [translationType, setTranslationType] = useState("tanglish-to-english");
  const [isListening, setIsListening] = useState(false);

  // Speech-to-Text Function
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition; // Ensure compatibility
  
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = translationType === "tamil-to-english" ? "ta-IN" : "en-US"; // Tamil/English
  
    recognition.onstart = () => {
      setIsListening(true);
    };
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
  
    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setIsListening(false);
    };
  
    recognition.start();
  };

  // Function to Translate Text
  const translateText = async () => {
    try {
      const res = await axios.post("https://transulate-gray.vercel.app/translate", {
        text: inputText,
        type: translationType,
      });
      setTranslatedText(res.data.translation);
    } catch (error) {
      console.error("Translation Error:", error);
      setTranslatedText("Error in translation");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>🔥 Tanglish & English Translator</h2>

      {/* Translation Type Dropdown */}
      <select
        value={translationType}
        onChange={(e) => setTranslationType(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      >
        <option value="tanglish-to-english">Tanglish ➡ English</option>
        <option value="english-to-tanglish">English ➡ Tanglish</option>
        <option value="tamil-to-english">Tamil ➡ English</option> {/* Newly Added Option */}
      </select>

      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {/* Input Text Area with Mic Button */}
        <div style={{ position: "relative" }}>
          <textarea
            placeholder="Enter or speak text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ width: "300px", height: "100px", padding: "10px" }}
          />
          <button
            onClick={startListening}
            style={{
              position: "absolute",
              right: "10px",
              bottom: "10px",
              padding: "5px 10px",
              background: isListening ? "red" : "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            🎤
          </button>
        </div>

        {/* Translated Text Output */}
        <textarea
          placeholder="Translation..."
          value={translatedText}
          readOnly
          style={{ width: "300px", height: "100px", padding: "10px", background: "#f0f0f0" }}
        />
      </div>

      <button onClick={translateText} style={{ marginTop: "20px", padding: "10px" }}>
        Translate
      </button>
    </div>
  );
}

export default App;