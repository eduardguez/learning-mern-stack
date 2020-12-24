const express = require("express");
const router = express.Router();

const Weather = require("./weather");

router.get("/weather", async (_, response) => {
  let weather = new Weather();
  let weatherData = await weather.getWeatherData(98052, "us");

  response.header("Content-Type", "application/json");
  response.send(JSON.stringify(weatherData, null, 4));
});

router.post("/weather", async (request, response) => {
  const { zipCode, tempMetric } = request.body;

  let weather = new Weather();
  let weatherData = await weather.getWeatherData(zipCode, tempMetric);

  response.header("Content-Type", "application/json");
  response.send(JSON.stringify(weatherData, null, 4));
});

router.post("/save_weather", async (request, response) => {
  const { zipCode, tempMetric } = request.body;
  let weather = new Weather();
  let weatherData = await weather.getWeatherData(zipCode, tempMetric);

  await weather.saveWeatherData(zipCode, weatherData);
  response.header("Content-Type", "application/json");
  response.send(JSON.stringify(weatherData, null, 4));
});

router.get("/weather_by_zipcode", async (request, response) => {
  const { zipCode } = request.query;
  let weather = new Weather();

  let weatherData = await weather.getWeatherDataByZipCode(zipCode);
  response.header("Content-Type", "application/json");
  response.send(JSON.stringify(weatherData, null, 4));
});

module.exports = router;
