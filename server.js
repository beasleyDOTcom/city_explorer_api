'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

//this bouncer (cors) would let a highschooler into the bar
app.use(cors());
const PORT = process.env.PORT || 3001;
app.get('/location', (request, response) => {
    try{
        let longLats = require('./data/location.json');
        let city = request.query.city;
    const obj = new Location(city, longLats);
    response.status(200).send(obj);        
    }  catch(error){
        console.log('ERROR', error);
        response.status(500).send('we messed ooops-sorry');
      }
});
//


app.get('/weather', (request, response) => {
    let weatherMan = require('./data/weather.json');
    let newArr = [];
    weatherMan.data.forEach(haha =>{
        newArr.push(new Weather(haha));
    });
    response.status(200).send(newArr);
});

function Location (city, longLats){
    this.search_query = city;
    this.formatted_query = longLats[0].display_name;
    this.latitude = longLats[0].lon;
    this.longitude = longLats[0].lat;
};

function Weather (totes){
    this.forecast = totes.weather.description;
    this.time = new Date(totes.valid_date).toDateString;
};

console.log("what do you think about that? HUH?")
app.get('*', (request, response) => {
    response.status(404).send('HAHA SUCKER! PAGE NOT FOUND');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
