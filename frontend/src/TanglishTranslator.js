import React, { useState } from "react";
import { Input, Typography, Card, Row, Col } from "antd";
import axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const TanglishTranslator = () => {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  // Function to translate text using Google Translate API
  const translateText = async (text) => {
    if (!text.trim()) {
      setTranslatedText("");
      return;
    }

    try {
      const response = await axios.post(
        "https://translate.googleapis.com/translate_a/single",
        {},
        {
          params: {
            client: "gtx",
            sl: "ta", // Source language (Tamil)
            tl: "en", // Target language (English)
            dt: "t",
            q: text,
          },
        }
      );

      // Extract translated text from API response
      setTranslatedText(response.data[0][0][0]);
    } catch (error) {
      setTranslatedText("Translation failed. Try again.");
    }
  };

  // Handle text input
  const handleChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    translateText(text);
  };

  return (
    <Card style={{ width: "80%", margin: "20px auto", padding: "20px" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Tanglish to English Translator
      </Title>
      <Row gutter={16}>
        {/* Left Side: Input Box */}
        <Col span={12}>
          <Title level={4}>Type in Tanglish:</Title>
          <TextArea
            rows={6}
            placeholder="Type Tanglish text here..."
            value={inputText}
            onChange={handleChange}
          />
        </Col>

        {/* Right Side: Output Box */}
        <Col span={12}>
          <Title level={4}>Translated English:</Title>
          <TextArea
            rows={6}
            value={translatedText}
            readOnly
            style={{ background: "#f5f5f5" }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default TanglishTranslator;
