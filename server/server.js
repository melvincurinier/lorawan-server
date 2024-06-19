require('dotenv').config();
const express = require('express');
const mySQLpool = require('./config/mysql');

// rest object
const app = express();

// middlewares
app.use(express.json());

// routes
app.use('/api/v1/sensor', require('./routes/sensorRoutes'));

app.get('/test', (req, res) => {
    res.status(200).send('<h1>Nodejs server</h1>');
});

// conditionaly listen
mySQLpool.query('SELECT 1').then(()=>{
    // MySQL
    console.log('MySQL Database Connected...');

    // listen
    app.listen(process.env.SERVER_PORT, () => {
        console.log('Server running on port ' + process.env.SERVER_PORT);
    });
}).catch((err)=>{
    console.log(err);
})

