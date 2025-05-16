require("dotenv").config();
const OpenAI = require("openai");

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Connect to SQLite DB
const db = new sqlite3.Database("./db/test.db", (err) => {
  if (err) {
    console.error("❌ Failed to connect to DB:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get("/api/customers", (req, res) => {
  db.all("SELECT * FROM cstmrs", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

// Smart AI route that turns question into SQL
app.post("/api/ask", async (req, res) => {
  const userQuestion = req.body.question;

  const prompt = `
You are an AI SQL assistant.
The database has two tables:
1. "cstmrs" with columns [id, nme, eml, joined_on]
2. "trnsxns" with columns [txn_id, cust_id, amt$, dt, typ]

Write a valid SQLite SQL query to answer this question:
"${userQuestion}"

Only return the SQL query. No explanation or extra text.
`;

  try {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });


    const sql = response.data.choices[0].message.content.trim();

    console.log("🔍 Generated SQL:", sql);

    // Validate if it starts with SELECT
    if (!sql.toLowerCase().startsWith("select")) {
      throw new Error("Generated SQL is not a SELECT query.");
    }

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error("❌ SQL Execution Error:", err.message);
        return res.status(500).json({ error: "SQL Error", details: err.message });
      }
      res.json({ sql, results: rows });
    });
  } catch (error) {
    console.error("❌ Ask Route Error:", error.message);
    res.status(500).json({ error: "OpenAI Error", details: error.message });
  }
});


// Default route
app.get("/", (req, res) => {
  res.send("🧠 AI Agent Backend Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
