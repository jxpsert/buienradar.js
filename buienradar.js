const fetch = require('node-fetch');
const API_URL = "https://data.buienradar.nl/2.0/feed/json";
const version = "1.0.0";
const copyright = "(C)opyright Buienradar / RTL. Alle rechten voorbehouden";
const terms = "Deze feed mag vrij worden gebruikt onder voorwaarde van bronvermelding buienradar.nl inclusief een hyperlink naar https://www.buienradar.nl. Aan de feed kunnen door gebruikers of andere personen geen rechten worden ontleend.";

async function getStationId(locationName){
    let locationId = 0;
    let res = await fetch(API_URL);
    let jsonResponse = await res.json();
    jsonResponse.actual.stationmeasurements.forEach(s =>{
      // console.log(s.regio.toLowerCase() + " " + locationName.toLowerCase());
            if(s.regio.toLowerCase() === locationName.toLowerCase()){
                locationId = s.stationid;
            }
        })
        return locationId;
}

async function stations(){
    let stations = [];
    let res = await fetch(API_URL);
    let jsonResponse = await res.json();
    jsonResponse.actual.stationmeasurements.forEach(s =>{
        stations.push(s.stationid);
    })
    return stations;
}

async function getStation(stationId){
    let stationInfo = {};
    let res = await fetch(API_URL);
     let jsonResponse = await res.json();
     jsonResponse.actual.stationmeasurements.forEach(s =>{
             if(s.stationid == stationId){
                 stationInfo = {
                     "id": s.stationid,
                     "name" : s.stationname,
                     "region": s.regio,
                     "description": s.weatherdescription,
                     "location" : [s.lat,s.lon],
                     "temperature": s.temperature,
                     "feelTemperature":s.feeltemperature,
                     "winddirection": s.winddirection,
                     "windspeed": s.windspeedBft * 4,
                     "icon": s.iconurl,
                     "rainfall": s.precipitation,
                     "rainfallLast": [s.rainFallLastHour, s.rainFallLast24Hour],
                     "time": s.timestamp
                 }
             }
         })
         return stationInfo;
}

async function getForecast(){
    let forecast = {};
    let res = await fetch(API_URL);
    let jsonResponse = await res.json();
    let data = jsonResponse.forecast.weatherreport;
    forecast = {
        "published": data.published,
        "title": data.title,
        "summary": data.summary,
        "long": data.text,
        "author": data.author,
        "authorbio": data.authorbio
    }
    return forecast;
}

async function fiveDayForecast(){
    let forecast = {};
    let res = await fetch(API_URL);
    let jsonResponse = await res.json();
    let data = jsonResponse.forecast.fivedayforecast[0];
    forecast = {
        "minTemperature": data.mintemperatureMin,
        "maxTemperature": data.maxtemperatureMax,
        "chanceOfRain": data.rainChance,
        "minRain": data.mmRainMin,
        "maxRain": data.mmRainMax,
        "summary": data.weatherdescription
    }
    return forecast;
}

module.exports = {
    version,
    copyright,
    terms,
    stations,
    getStationId,
    getStation,
    getForecast,
    fiveDayForecast
};
