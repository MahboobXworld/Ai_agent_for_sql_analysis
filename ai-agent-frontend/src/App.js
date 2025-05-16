import React, { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [results, setResults] = useState([]);
  const [sql, setSql] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setSql(data.sql);
      setResults(data.results);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🧠 AI Data Agent</h1>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a data question..."
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <button onClick={askQuestion}>Ask</button>

      {loading && <p>Loading...</p>}

      {sql && (
        <div>
          <h3>💡 Generated SQL</h3>
          <pre>{sql}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <h3>📊 Results</h3>
          <table>
            <thead>
              <tr>
                {Object.keys(results[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j}>{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
