const axios = require("axios");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const API_KEY = "fa67934bfb70ec2f4d082cdf0cb06e87"; // Replace with your API Key
const CITY = "VARANASI"; // Replace with your city
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

// Ensure the 'assets' folder exists
const assetsDir = path.join(__dirname, "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

async function fetchWeather() {
  try {
    const response = await axios.get(URL);
    const { main, weather } = response.data;

    const temperature = `${Math.round(main.temp)}°C`;
    const condition = weather[0].main;
    const icon = getWeatherIcon(condition);

    await generateImage(temperature, condition, icon);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

// Function to get a weather icon based on condition
function getWeatherIcon(condition) {
  const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Fog: "🌫️",
    Haze: "🌁",
    Smoke: "💨",
  };
  return icons[condition] || "🌍";
}

async function generateImage(temp, condition, icon) {
  const size = 300; // Circular canvas size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // **Create Circular Clipping Mask**
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.clip();

  // **🌈 Gradient Background Based on Condition**
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  if (condition.includes("Clear")) {
    gradient.addColorStop(0, "#ff9a9e");
    gradient.addColorStop(1, "#fad0c4");
  } else if (condition.includes("Clouds")) {
    gradient.addColorStop(0, "#bdc3c7");
    gradient.addColorStop(1, "#2c3e50");
  } else if (condition.includes("Rain")) {
    gradient.addColorStop(0, "#1e3c72");
    gradient.addColorStop(1, "#2a5298");
  } else {
    gradient.addColorStop(0, "#2C5364");
    gradient.addColorStop(1, "#203A43");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // **🌟 Styling for Text**
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px Arial";
  ctx.textAlign = "center";

  ctx.fillText(`🌍 ${CITY}`, size / 2, size / 4);
  ctx.font = "bold 50px Arial";
  ctx.fillText(`${icon} ${temp}`, size / 2, size / 2);
  ctx.font = "20px Arial";
  ctx.fillText(`Condition: ${condition}`, size / 2, size - 50);

  // **📍 Save Image**
  const imagePath = path.join(assetsDir, "weather.png");
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(imagePath, buffer);
  console.log(`Weather image updated at: ${imagePath}`);
}

fetchWeather();
