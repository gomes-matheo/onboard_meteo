//ASYNC FUNCTION FOR FETCHING EXTERNAL JSON FILE TO A JS OBJECT
async function fetchConfigFile() {
  try {
    //GET PROMISE AND WAIT FOR SERVER RESPONSE
    const response = await fetch("config/config.json");

    //IF HTTP STATUS RETURNS OK => CONVERT FETCHED JSON TO JS OBJECT
    if (response.status === 200) {
      console.log("Successfully received config.json informations");

      //GET PROMISE AND WAIT FOR JSON CONSTRUCTION
      const configBody = await response.json();
      console.log(configBody);
      return configBody;

      ///IF HTTPS STATUS RETURNS NOT FOUND
    } else if (response.status === 404) {
      console.log("config.json not found");
    } else {
    }
    console.log(response);
  } catch (error) {
    // FOR EXTERNAL OR UKNOWN ERRORS
    window.alert("A config.json error has occured");
    console.error(error);
  }
}

//ASYNC FUNCTION FOR FETCHING WEATHER API FROM "openweathermap.com"
async function fetchWeatherApi(town) {
  const mesureUnits = "metric";
  const apiKey = "72b86c523ab4533f085efceb8ce41edf";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    town +
    "&appid=" +
    apiKey;
  //+"&units=metric";   //METRIC DONT WORK ?

  try {
    //GET PROMISE AND WAIT FOR SERVER RESPONSE
    const weatherInfos = await fetch(apiUrl);

    //IF HTTP STATUS RETURNS OK => CONVERT FETCHED JSON TO JS OBJECT
    if (weatherInfos.status === 200) {
      console.log("Successfully received API informations");

      //GET PROMISE AND WAIT FOR JSON CONSTRUCTION
      const weatherData = await weatherInfos.json();
      console.log("Prepare return of weatherData");
      console.log(weatherData);
      return weatherData;

      ///IF HTTPS STATUS RETURNS NOT FOUND
    } else if (weatherInfos.status === 404) {
      console.log("API not found");
    } else {
    }
    console.log(weatherInfos);
  } catch (error) {
    // FOR EXTERNAL OR UKNOWN ERRORS
    window.alert("An unknown API error has occured");
    console.error(error);
  }
}

//REAL TIME CLOCK CONFIGURATION AND DISPLAY (from local, not using api)
function updateTime() {
  //REAL TIME DISPLAY (not using api)
  const currentDay = new Date();

  let currentHour = String(currentDay.getHours()).padStart(2, "0");
  let currentMinute = String(currentDay.getMinutes()).padStart(2, "0");
  let currentSecond = String(currentDay.getSeconds()).padStart(2, "0");

  const currentTime = currentHour + ":" + currentMinute + ":" + currentSecond;

  //DISPLAY TIME INFOS
  document.getElementById("timeInfo").innerHTML =
    "Current Time : " + currentTime;
}

//MAIN FUNCTION TO EXECUTE ALL HTML MODIFICATION, FETCH, ETC
async function main() {
  console.log("REFRESHED MAIN FUNCTION");

  //CONFIG FILE INFOS
  const jsonConfigMain = await fetchConfigFile();
  town = jsonConfigMain.town;
  console.log("Successfully parsed config.json infos : " + town);

  //API ACCESS INFOS
  console.log("Testing API...");
  const weatherApiInfos = await fetchWeatherApi(town);

  //API WEATHER INFOS
  weatherDesc = weatherApiInfos.weather[0].description;
  console.log("Weather is : " + weatherDesc);

  //API TEMPERATURE INFOS + WE NEED TO CONVERT KELVIN TO CELSIUS
  temperature = weatherApiInfos.main.temp;
  celsiusTemp = (temperature - 273.15).toFixed(2);
  console.log("Temperature is : " + celsiusTemp);

  //API FELT TEMPERATURE INFOS + WE NEED TO CONVERT KELVIN TO CELSIUS
  temperatureFelt = weatherApiInfos.main.feels_like;
  temperatureFeltCelsius = (temperatureFelt - 273.15).toFixed(2);
  console.log("Felt temperature is : " + temperatureFeltCelsius);

  //API HUMIDITY INFOS
  humidity = weatherApiInfos.main.humidity;
  console.log(humidity + "%");

  //API WIND INFOS
  windSpeed = weatherApiInfos.wind.speed;
  console.log("Wind speed is : " + windSpeed);

  //SET INFOS TO HTML BODY FROM IDS
  document.getElementById("TownInfo").innerHTML = town;
  document.getElementById("MeteoInfo").innerHTML = weatherDesc;
  setInterval(updateTime, 1000);
  document.getElementById("TemperatureInfo").innerHTML = celsiusTemp + "°C";
  document.getElementById("FeltTemperature").innerHTML =
    temperatureFeltCelsius + "°C";
  document.getElementById("HumidityInfos").innerHTML = humidity + "%";
  document.getElementById("WindSpeed").innerHTML =
    (windSpeed * 2.769).toFixed(2) + "Km/h";
}

//DEBUG
console.log("Hello World!");

//FIRST EXECUTION OF MAIN
main();

//AUTO REFRESH AFTER AN HOUR (after user page load)
setInterval(() => {
  console.log("refreshing API");
  main();
}, 60 * 60 * 1000); //60h * 60min * 1000ms
