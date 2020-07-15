'use strict';
//all your libraries
const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');
const { json } = require('express');
let lotty = '';
let latty = '';
require('dotenv').config();

//this bouncer (cors) would let a highschooler into the bar
app.use(cors());
const PORT = process.env.PORT || 3001;




//let's get the data from the location api
app.get('/location', bungleLocation);
function bungleLocation(request, response){    
    let city = request.query.city;
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
            console.log("these are my results from superagent", resultFromSuperagent.body)
            let mapData = resultFromSuperagent.body;
            const obj = new Location(city, mapData);
            response.send(obj);
        }).catch((error) => {
            console.log("error with superagent", error);
            response.status(500).send("we messed OOPS orry");
        });
}
    //let longLats = require('./data/location.json');
     //   let city = request.query.city;
//     const obj = new Location(city, longLats);
//     response.status(200).send(obj);        
//     }  catch(error){
//         console.log('ERROR', error);
//         response.status(500).send('we messed ooops-sorry');
//       }
// });
//


// app.get('/weather', (request, response) => {
//     let weatherMan = require('./data/weather.json');
//     let newArr = weatherMan.data.map(day => {
//         return new Weather(day);
//     })

//     // weatherMan.data.forEach(haha =>{
//     //     newArr.push(new Weather(haha));
//     // });
//     response.status(200).send(newArr);
// });
app.get('/weather', bungleWeather);
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
            console.log("these are my results from weather superagent", resultFromSuperagent.body.data)
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

console.log("what do you think about that? HUH?")
app.get('*', (request, response) => {
    response.status(404).send('HAHA SUCKER! PAGE NOT FOUND');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
