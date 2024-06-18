const express = require('express');

// rest object
const app = express();

// middlewares

// routes
app.get('/test', (req, res) => {
    res.status(200).send('<h1>Nodejs server</h1>');
})

// port
const PORT = 8080;

// listen
app.listen(PORT, () => {
    console.log("Server running...");
})