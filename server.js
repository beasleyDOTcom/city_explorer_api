'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
const PORT = process.env.PORT || 3001;
app.get('/location', (request, response) => {

});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})
