import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const OCR_KEY = process.env.OCR_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY2;

const ocrSpaceFile = async (fileBuffer, originalName) => {
    const form = new FormData();
    form.append('apikey', OCR_KEY);
    form.append('language', 'eng');
    form.append('isOverlayRequired', 'false');
    form.append('file', fileBuffer, originalName);

    const response = await axios.post('https://api.ocr.space/parse/image', form, {
        headers: { ...form.getHeaders() }
    });

    const ocrData = response.data;
    if (ocrData && ocrData.ParsedResults) {
        return ocrData.ParsedResults.map(result => result.ParsedText).join('\n');
    } else {
        throw new Error('Failed to extract text from PDF.');
    }
};

const analyzeWithGroq = async (text) => {
    try {
      const groq = new Groq({ apiKey: GROQ_KEY });
  
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `
              Given the following extracted text from a product warranty document, extract the details based on this product schema:
  
              **Extracted Text:**
              ${text}
  
              **Extract the following details:**
              - **productName**
              - **brand**
              - **category**
              - **purchaseDate**
              - **warrantyExpiryDate**
              - **purchasePrice**
              - **seller**
              - **invoiceUrl**
              - **warrantyDocUrl**
              - **warrantyTerms**

              Assign a general category to the thing that matches the type of thing.

              If the warranty duration is mentioned then calculate the expiry date by yourself.
  
              If any detail is missing, return **null** for that field.
  
              **Output ONLY a JSON object with no extra explanation or markdown formatting.**
            `,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });
  
      let responseText = completion?.choices?.[0]?.message?.content || "No response";
  
      // Clean markdown-style code block if present
      responseText = responseText.trim();
  
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/```(?:json)?/, "").replace(/```$/, "").trim();
      }
  
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Groq Analysis Error:", error.message);
      throw error;
    }
  };
  
export const extractDataFromPDF = async (file) => {
    try {
      console.log("Extracting text with OCR.space...");
      const extractedText = await ocrSpaceFile(file.buffer, file.originalname);
  
      console.log("Analyzing with Groq...");
      const analysisResult = await analyzeWithGroq(extractedText);
  
      console.log("\n✅ Warranty Details:", analysisResult);
      return analysisResult;
    } catch (error) {
      console.error("Processing Error:", error.message);
      throw error;
    }
  };
