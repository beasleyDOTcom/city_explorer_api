'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
const PORT = process.env.PORT || 3001;
app.get('/location', (request, response) => {

});




console.log("what do you think about that? HUH?")
app.get('*', (request, response) => {
    response.status(404).send('HAHA SUCKER! PAGE NOT FOUND');
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
