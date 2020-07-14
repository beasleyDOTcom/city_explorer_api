'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

//this bouncer would let a highschooler into the bar
app.use(cors());
const PORT = process.env.PORT || 3001;
app.get('/location', (request, response) => {
        let longLats = require('./data/location.json');
        // console.log(request);
        let city = request.query.city;
        // let cityName = ((longLats) => {
        //     let city = longLats[0].display_name.split(',');
        //     console.log("this is your city", city[0]);
        // });
    const obj = new Location(city, longLats);
// console.log(obj);
    response.send(obj);
// this is the end of the try.        
});
app.get('/weather', (request, response) => {
    let weatherMan = require('./data/weather.json');
    let newArr = [];
    weatherMan.data.forEach(haha =>{
        newArr.push(new Weather(haha));
    });
    response.send(newArr);
});

function Location (city, longLats){
    this.search_query = city;
    this.formatted_query = longLats[0].display_name;
    this.latitude = longLats[0].lon;
    this.longitude = longLats[0].lat;
};

function Weather (totes){
    this.forecast = totes.weather.description;
    this.time = totes.valid_date;
}

console.log("what do you think about that? HUH?")
app.get('*', (request, response) => {
    response.status(404).send('HAHA SUCKER! PAGE NOT FOUND');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
