// Import required modules
const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load .env file

// Initialize router
const router = express.Router();

// Home page route
router.get("/", (req, res) => {
  res.render("index");
});

// Handle weather check
router.post("/check-weather", async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Debugging logs
  console.log(`City: ${city}`);
  console.log(`API Key: ${apiKey}`);
  console.log(`URL: ${url}`);

  try {
    const response = await axios.get(url);

    // Check if the city was not found
    if (response.data.cod === "404") {
      return res.render("error", { message: "City not found. Try again." });
    }

    const data = response.data.list;

    // Get data for tomorrow (24 hours ahead)
    const tomorrow = data.find((item) =>
      item.dt_txt.includes(
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      )
    );

    // Check if rain is expected
    const willRain = tomorrow?.weather.some(
      (w) => w.main.toLowerCase() === "rain"
    );

    res.render("result", { city, willRain });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.render("error", { message: "City not found or API error." });
  }
});

// Export router
module.exports = router;
