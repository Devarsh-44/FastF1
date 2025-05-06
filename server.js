const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());

//  New Endpoint to Get Available Races
app.get("/api/races", (req, res) => {
  const races = [
    // 2021 Season Races
    "Bahrain",
    "Emilia Romagna",
    "Portugal",
    "Spain",
    "Monaco",
    "Azerbaijan",
    "France",
    "Styrian",
    "Austria",
    "British",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Russia",
    "Turkey",
    "United States",
    "Mexico",
    "Brazil",
    "Qatar",
    "Saudi Arabia",
    "Abu Dhabi",

    // 2022 Season Races
    "Bahrain",
    "Saudi Arabia",
    "Australia",
    "Imola",
    "Miami",
    "Spain",
    "Monaco",
    "Azerbaijan",
    "Canada",
    "Silverstone",
    "Austria",
    "France",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Singapore",
    "Japan",
    "United States",
    "Mexico",
    "Brazil",
    "Abu Dhabi",

    // 2023 Season Races
    "Bahrain",
    "Saudi Arabia",
    "Australia",
    "Azerbaijan",
    "Miami",
    "Monaco",
    "Spain",
    "Canada",
    "Austria",
    "Britain",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Singapore",
    "Japan",
    "Qatar",
    "United States",
    "Mexico",
    "Brazil",
    "Las Vegas",
    "Abu Dhabi",

    // 2024 Season Races (Example Races)
    "Bahrain",
    "Saudi Arabia",
    "Australia",
    "Azerbaijan",
    "Miami",
    "Monaco",
    "Spain",
    "Canada",
    "Austria",
    "Silverstone",
    "Hungary",
    "Belgium",
    "Netherlands",
    "Italy",
    "Singapore",
    "Japan",
    "Qatar",
    "United States",
    "Mexico",
    "Brazil",
    "Abu Dhabi",
  ];

  res.json({ races });
});

// New Endpoint to Get Available Drivers
app.get("/api/drivers", (req, res) => {
  const drivers = [
    { code: "VER", name: "Max Verstappen", number: 1 },
    { code: "HAM", name: "Lewis Hamilton", number: 44 },
    { code: "LEC", name: "Charles Leclerc", number: 16 },
    { code: "BOT", name: "Valtteri Bottas", number: 77 },
    { code: "NOR", name: "Lando Norris", number: 4 },
    { code: "RIC", name: "Daniel Ricciardo", number: 3 },
    { code: "SAI", name: "Carlos Sainz", number: 55 },
    { code: "ALO", name: "Fernando Alonso", number: 14 },
    { code: "VET", name: "Sebastian Vettel", number: 5 },
    { code: "STR", name: "Lance Stroll", number: 18 },
    { code: "RAI", name: "Kimi Räikkönen", number: 7 },
    { code: "GIO", name: "Antonio Giovinazzi", number: 99 },
    { code: "GAS", name: "Pierre Gasly", number: 10 },
    { code: "TSU", name: "Yuki Tsunoda", number: 22 },
    { code: "LAT", name: "Nicholas Latifi", number: 6 },
    { code: "RUS", name: "George Russell", number: 63 },
    { code: "MSC", name: "Mick Schumacher", number: 47 },
    { code: "MAZ", name: "Nikita Mazepin", number: 9 },

    // New drivers in 2022 and beyond:
    { code: "ZHO", name: "Zhou Guanyu", number: 24 },
    { code: "PIT", name: "Oscar Piastri", number: 81 },
    { code: "ALB", name: "Alex Albon", number: 23 },
    { code: "HUL", name: "Nico Hülkenberg", number: 27 },

    // 2023 Season Rookies and More
    { code: "DEV", name: "Nyck de Vries", number: 21 },
    { code: "SCO", name: "Logan Sargeant", number: 2 },

    // For 2024 and future seasons, this would need to include drivers like:
    { code: "KIM", name: "Kimi Antonelli", number: 23 }, // Example for future rookie
  ];
  res.json({ drivers });
});

// Existing Lap Time Fetching
app.get("/api/laptimes", (req, res) => {
  const race = req.query.race || "Bahrain";
  const driver = req.query.driver || "all";
  const filter = req.query.filter || "all";

  console.log(
    `Fetching lap times for Race: ${race}, Driver: ${driver}, Filter: ${filter}`
  );

  const pythonProcess = spawn("python", ["laptime.py", race, driver, filter]);

  let dataString = "";

  pythonProcess.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Python Error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    try {
      console.log("Raw Data from Python:", dataString);
      const jsonData = JSON.parse(dataString);
      res.json(jsonData);
    } catch (error) {
      console.error("Error parsing JSON:", error.message);
      res.status(500).json({ error: "Invalid JSON format from Python" });
    }
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
