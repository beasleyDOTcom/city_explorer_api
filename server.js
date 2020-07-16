'use strict';
//all your libraries
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();
const pg = require('pg');
//this bouncer (cors) would let a highschooler into the bar
app.use(cors());
const client = new pg.Client(process.env.WINDOWS_DATABASE_URL);
client.on('error', err => {
    console.log('er ROAR!!! on line 13', err);
});

const PORT = process.env.PORT || 3001;
//if you need to close all of your ports. In your termnial you 'pkill node'
//let's get the data from the location api
app.get('/location', bungleLocation);
app.get('/weather', bungleWeather);
app.get('/trails', bungleTrails);
// what does the database return if it doesn't have what I'm looking for?
//what does the API return if it doesn't have what I'm looking for?
function addLocation(object){
    let search_query = object.search_query;
    let formatted_query = object.formatted_query;
    let latitude = object.latitude;
    let longitude = object.longitude;
    let sqlStatement = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4);';
    let safeValues = [search_query, formatted_query, latitude, longitude];
    client.query(sqlStatement, safeValues);
}

function bungleLocation(request, response){    
    let city = request.query.city;
    let safeValues = [city];
    let searchString = 'SELECT * FROM locations WHERE search_query=$1;';
    client.query(searchString, safeValues)
    .then(location =>{
        if(location.rowCount > 0){
            response.send(location.rows[0]);
        }
        else{
            let url = 'https://us1.locationiq.com/v1/search.php';
            let mapParams = {
                key: process.env.GEOCODE_API_KEY,
                q: city,
                format: 'json',
                limit: 1
            };    
            superagent.get(url)
            .query(mapParams)
            .then(resultFromSuperagent => {
                let mapData = resultFromSuperagent.body;
                const obj = new Location(city, mapData);
                addLocation(obj);
                response.status(200).send(obj);
            }).catch((error) => {
                response.status(500).send("we messed OOPS orry");
            });

        }
        })
    };

function bungleWeather(request, response){    
    let city = request.query.city;
    let url = 'https://api.weatherbit.io/v2.0/forecast/daily';
    let weatherParams = {
        key: process.env.WEATHER_API_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude,
        format: 'json',
        days: 8
    };
    superagent.get(url)
        .query(weatherParams)
        .then(resultFromSuperagent => {
            let weatherData = resultFromSuperagent.body;
            let weatherDays = weatherData.data.map(day => {
                return new Weather(day);
        })
        response.send(weatherDays);
    }).catch((error) => {
            console.log("error with superagent", error);
            response.status(500).send("we messed OOPS orry");
        });
}
// hiking section:

function bungleTrails(request, response){    
    let url = 'https://www.hikingproject.com/data/get-trails';
    let trailParams = {
        key: process.env.TRAIL_API_KEY,
        lat: request.query.latitude,
        lon: request.query.longitude
    };
    superagent.get(url)
        .query(trailParams)
        .then(resultFromSuperagent => {
            let hikes = resultFromSuperagent.body.trails.map(hike => {
                return new Trail(hike);
        })
        response.send(hikes);
    }).catch((error) => {
            console.log("error with superagent", error);
            response.status(500).send("we messed OOPS orry");
        });
}
function Location (city, longLats){
    this.search_query = city;
    this.formatted_query = longLats[0].display_name;
    this.latitude = longLats[0].lat;
    this.longitude = longLats[0].lon;
};

function Weather (totes){
    this.forecast = totes.weather.description;
    this.time = new Date(totes.valid_date).toDateString();
};

function Trail (obj){
    this.name = obj.name;
    this.location = obj.location;
    this.length = obj.length;
    this.stars = obj.stars;
    this.star_votes =  obj.starVotes;
    this.summary = obj.summary;
    this.trail_url = obj.url;
    this.conditions = obj.conditionDetails;
    this.condition_date = obj.conditionDate;
    this.condition_time = obj.condition_time;
}

app.get('*', (request, response) => {
    response.status(404).send('HAHA SUCKER! you are cool but.... PAGE NOT FOUND');
});
client.connect()
.then(() => {
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})})
