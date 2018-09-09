const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios')
var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

let url = "https://api.nicehash.com/api"
let testAddress = "3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4"

// Get current stats for provider for all algorithms. Refreshed every 30 seconds. It also returns past 56 payments.
let addressUrl = "https://api.nicehash.com/api?method=stats.provider&addr=" 

// Past 7 days worth of allgorithims and payments
let sevenDayHistory = "https://api.nicehash.com/api?method=stats.provider.ex&addr="

// Get payments for provider.
let paymentHistory = "https://api.nicehash.com/api?method=stats.provider.payments&addr=" 

// Workers (rigs)
let workers = "https://api.nicehash.com/api?method=stats.provider.workers&addr="

app.get("/api", (req, res) => {
    axios.get(url)
        .then(response => {
            // ! If you send back resopnse by itself it will break into TypeConverter
            res.json(response.data);

        })
        .catch(error => {
            res.json({
                message: 'Cant connect to API'
            })
            console.log(error);
        });
})

app.get("/api/address", (req, res) => {
    let myAddress = addressUrl + testAddress
    axios.get(myAddress)
        .then(response => {
            res.json(response.data);

        })
        .catch(error => {
            res.json({
                message: 'Cant connect to API'
            })
            console.log(error);
        });
})

app.get("/api/about", (req, res) => {
    axios.get('https://api.nicehash.com/api')
        .then(response => {
            res.json(response.data);

        })
        .catch(error => {
            res.json({
                message: 'Cant connect to API'
            })
            console.log(error);
        });
})

app.listen(port);