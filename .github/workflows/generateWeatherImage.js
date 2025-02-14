const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const API_KEY = "fa67934bfb70ec2f4d082cdf0cb06e87"; // Replace with your API Key
const CITY = "Varanasi"; // Replace with your city
const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

async function fetchWeather() {
  try {
    const response = await axios.get(URL);
    const { main, weather } = response.data;

    const temperature = `${Math.round(main.temp)}°C`;
    const condition = weather[0].main;

    await generateImage(temperature, condition);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function generateImage(temp, condition) {
  const canvas = createCanvas(500, 250);
  const ctx = canvas.getContext("2d");

  // Background Color
  ctx.fillStyle = "#282c34";
  ctx.fillRect(0, 0, 500, 250);

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "30px Arial";
  ctx.fillText(`Weather in ${CITY}:`, 50, 50);
  ctx.fillText(`🌡 ${temp}`, 50, 100);
  ctx.fillText(`☁ ${condition}`, 50, 150);

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("weather.png", buffer);
  console.log("Weather image updated!");
}

fetchWeather();
