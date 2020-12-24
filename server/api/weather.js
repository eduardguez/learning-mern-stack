const WEATHER = require("../models/Weather");
const axios = require("axios");

require("dotenv").config({ path: "./../../../.env" });

const baseUrl = "http://api.openweathermap.org/data/2.5/weather";

class Weather {

  /**
   * Gets the weather data based on the zipcode and which temp system to converge to (imperial/metric system)
   *
   * @param {number} zipCode The zipcode used to get the weather info from the weather api
   * @param {string} tempMetric This is either "imperial" (use Fahrenheit) or "metric" (use Celsius)
   * @return {JSON} The data response from the weather api call.
   */
  getWeatherData = async (zipCode, tempMetric) => {
    let url = `${baseUrl}?zip=${zipCode},us&appid=${process.env.WEATHER_KEY}&units=${tempMetric}`;
    return (await axios(url)).data;
  }

  /**
   * If a document already exists with the filter, then replace, if not, add.
   *
   * @param {{zip_code: number}} filter The filter is the zipcode used as unique identifier to find the document from mongo
   * @return {JSON} The data response from the mongodb.
   */
  async findOneReplace(filter, replace) {
    await WEATHER.findOneAndReplace(filter, replace, { new: true, upsert: true });
  }

  /**
   * Saves the weather data using the zipcode as the unique identifier
   * If it already exists, replace, if not, then add.
   *
   * @param {number} zipCode The zipcode used to identify the document to upsert
   * @param {string} data Weather data to save/update
   * @return {JSON} The data response from the weather api data.
   */
  saveWeatherDataToMongo = async (zipCode, data) => {
    const filter = {
      zip_code: zipCode
    }

    const replace = {
      ...filter,
      ...data,
      data: Date.now()
    }
    await this.findOneReplace(filter, replace);
  }

}

module.exports = Weather;
