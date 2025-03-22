import Groq from "groq-sdk"; // Import the Groq SDK
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create an instance of the Groq client with the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log("groq:"+groq);
app.post("/generate", async (req, res) => {
  const { prompt, model = "llama-3.3-70b-versatile" } = req.body;  // Default model is "llama-3.3-70b-versatile"

  if (!prompt) {
    return res.status(400).json({ error: "Please provide a prompt" });
  }

  try {
    // Create a chat completion request using the Groq SDK
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt, // Pass the user's prompt here
        },
      ],
      model: model, // Use the model passed in or default model
    });

    // Return the response content from the completion
    res.json({ response: completion.choices[0].message.content });

  } catch (err) {
    console.error("Error with GROQ API:", err.response ? err.response.data : err.message);
    res.status(500).json({
      error: "Failed to generate response",
      details: err.response ? err.response.data : err.message,
    });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
