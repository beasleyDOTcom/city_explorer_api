'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

//this bouncer would let a highschooler into the bar
app.use(cors());
const PORT = process.env.PORT || 3001;
app.get('/location', (request, response) => {
        let longLats = require('data/location.json');
        let cityName = ((longLats) => {
            let city = longLats[0].display_name.split(',');
            console.log("this is your city", city[0]);
            
        });
        const obj = new Location(longLats);

// this is the end of the try.        
});

function Location (location){
    this.search_query = 
    this.longitude =
    this.latitude =
};


console.log("what do you think about that? HUH?")
app.get('*', (request, response) => {
    response.status(404).send('HAHA SUCKER! PAGE NOT FOUND');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
