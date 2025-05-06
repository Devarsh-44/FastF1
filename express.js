const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express(); // ✅ Initialize app FIRST
app.use(cors({ origin: "http://localhost:3000" })); // ✅ Then use CORS

app.get("/api/laptimes", (req, res) => {
  const pythonProcess = spawn("python", ["laptime.py"]);
  app.get("/api/laptimes", (req, res) => {
    res.json([
      { Driver: "VER", LapTime: 97.284 },
      { Driver: "VER", LapTime: 96.296 },
      { Driver: "VER", LapTime: 95.16 },
    ]);
  });
  let result = "";

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error from Python: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    try {
      const jsonData = JSON.parse(result); // Ensure it's valid JSON
      res.json(jsonData);
    } catch (error) {
      res.status(500).json({ error: "Invalid JSON response from Python" });
    }
  });
});

app.listen(3001, () => {
  console.log("Server running at http://localhost:3001");
});
