require("dotenv").config();

const express = require("express");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = process.env.PORT || 3000;
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;
async function connectToMongoDB() {
  await mongoClient.connect();
  db = mongoClient.db("studymate");
  console.log("MongoDB connected successfully!");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});



app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "Frontend connected to StudyMate AI backend! 🚀"
  });
});

// ==============================
// EXPLAIN TOPIC
// ==============================
app.post("/api/explain", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        error: "Topic is required."
      });
    }

    console.log("Explain request:", topic);

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Explain this academic topic in simple student-friendly language.

Topic:
${topic}

Include:
1. Simple definition
2. Main points
3. Short example
4. Easy conclusion`
    });

    res.json({
      explanation: response.text
    });

  } catch (error) {
    console.error("Explain AI error:", error);

    res.status(500).json({
      error: "Failed to generate explanation."
    });
  }
});

// ==============================
// SUMMARIZE NOTES
// ==============================
app.post("/api/summarize", async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        error: "Notes are required."
      });
    }

    console.log("Summarize request received.");
    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Summarize the following study notes in simple language.

Keep:
- Important points
- Important definitions
- Important concepts
- Useful examples

Remove unnecessary information.

Study Notes:
${notes}`
    });

    console.log("Summary generated successfully.");

    res.json({
      summary: response.text
    });

  } catch (error) {
    console.error("Summarize AI error:", error);

    res.status(500).json({
      error: "Failed to summarize notes."
    });
  }
});

app.post("/api/quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        error: "Topic is required."
      });
    }

    console.log("Quiz request received.");

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Sending quiz request to Gemini... Attempt ${attempt}`);

        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: `Create a short quiz for a student based on this topic.

Generate exactly 5 multiple-choice questions about this topic.

For every question, use this exact format:

Question 1: Write the question here?
A) First option
B) Second option
C) Third option
D) Fourth option
Correct Answer: B
Explanation: Explain briefly why B is correct.

Repeat the same format for Questions 2, 3, 4, and 5.

STRICT RULES:
- Provide exactly 4 options labelled A), B), C), and D).
- Write the correct answer as a single letter only: A, B, C, or D.
- Ensure the correct answer matches the correct option.
- Include a short explanation for each question.
- Do not use Markdown tables or code blocks.
- Do not include an introduction or conclusion.
- Do not reveal answers before the questions.
- Keep the quiz simple and educational.

Topic:
${topic}`
        });

        break;

      } catch (error) {
        console.error(`Quiz attempt ${attempt} failed.`);

        if (error.status === 503 && attempt < 3) {
          console.log("Gemini is busy. Waiting before retry...");
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          throw error;
        }
      }
    }

    console.log("Quiz generated successfully.");

    res.json({
      quiz: response.text
    });

  } catch (error) {
    console.error("Quiz AI error:", error);

    res.status(500).json({
      error: "Failed to generate quiz."
    });
  }
});


// ============================
// STUDY PLAN
// ============================

app.post("/api/study-plan", async (req, res) => {
  try {
    const { details } = req.body;

    if (!details || !details.trim()) {
      return res.status(400).json({
        error: "Study plan details are required."
      });
    }

    console.log("Study plan request received.");
    console.log("Sending study plan request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `Create a simple and realistic study plan for a student.

Student requirements:
${details}

Include:
1. A day-by-day study schedule.
2. Topics to study each day.
3. Revision time.
4. Coding practice activities (describe the tasks only).
5. A final revision day, only if it fits within the requested number of days.

Important rules:
- Follow exactly the number of days requested by the student.
- Follow the requested study time per day.
- Do not add extra or bonus days.
- Do not generate quiz questions, multiple-choice questions, answers, or explanations.
- Do not include a separate quiz section.
- Only provide the study plan and its daily learning, practice, and revision activities.

Keep the plan simple, practical, and student-friendly.`
    });

    console.log("Study plan generated successfully.");

    res.json({
      plan: response.text
    });

  } catch (error) {
    console.error("Study Plan AI error:", error);

    res.status(500).json({
      error: "Failed to generate study plan."
    });
  }
});


 // SIGN UP
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Please fill in all fields."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters."
      });
    }

    const users = db.collection("users");
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await users.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await users.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: new Date()
    });

    return res.status(201).json({
      message: "Account created successfully. You can now log in."
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      error: "Unable to create account. Please try again."
    });
  }
});


 // LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please enter your email and password."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await db.collection("users").findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password."
      });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Unable to log in. Please try again."
    });
  }
});


// ==============================
// START SERVER
// ==============================
async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`StudyMate AI server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
}

startServer();

