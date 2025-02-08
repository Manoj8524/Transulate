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
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = translationType === "tamil-to-english" ? "ta-IN" : "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      setInputText(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  // Function to Translate Text
  const translateText = async () => {
    try {
      const res = await axios.post("https://transulate-nine.vercel.app/translate", {
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
    <div className="flex flex-col items-center p-5 w-full min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">🔥 Tanglish & English Translator</h2>

      {/* Translation Type Dropdown */}
      <select
        value={translationType}
        onChange={(e) => setTranslationType(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        <option value="tanglish-to-english">Tanglish ➡ English</option>
        <option value="english-to-tanglish">English ➡ Tanglish</option>
        <option value="tamil-to-english">Tamil ➡ English</option>
      </select>

      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-3xl">
        {/* Input Text Area with Mic Button */}
        <div className="relative w-full md:w-1/2">
          <textarea
            placeholder="Enter or speak text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded"
          />
          <button
            onClick={startListening}
            className={`absolute right-3 bottom-3 p-2 text-white rounded ${isListening ? "bg-red-500" : "bg-blue-500"}`}
          >
            🎤
          </button>
        </div>

        {/* Translated Text Output */}
        <textarea
          placeholder="Translation..."
          value={translatedText}
          readOnly
          className="w-full md:w-1/2 h-32 p-3 bg-gray-200 border border-gray-300 rounded"
        />
      </div>

      <button 
        onClick={translateText} 
        className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600"
      >
        Translate
      </button>
    </div>
  );
}

export default App;