const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios')
const blockchain = require('blockchain.info')
var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

let url = "https://api.nicehash.com/api"
let testAddress1 = "3LWh12U6ACgG9j4rq4ExagfMxNR8GgnGs4" // B
let testAddress2 = "3JuqAiWuAma26iYvKjzGCTEHq6A8R4ZusZ" // E
let testAddress3 = "3Ls4oRPWP3rxhPKsWgi4CYaK6E6c8HSekv" // J

// Get current stats for provider for all algorithms. Refreshed every 30 seconds. It also returns past 56 payments.
let addressUrl = "https://api.nicehash.com/api?method=stats.provider&addr="

// Past 7 days worth of allgorithims and payments
let sevenDayHistory = "https://api.nicehash.com/api?method=stats.provider.ex&addr="

// Get payments for provider.
let paymentHistory = "https://api.nicehash.com/api?method=stats.provider.payments&addr="

// Workers (rigs)
let workers = "https://api.nicehash.com/api?method=stats.provider.workers&addr="

app.get("/api/nh", (req, res) => {
    axios.get(url)
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

app.get("/api/nh/address", (req, res) => {
    console.log(req.body)
    let myAddress = addressUrl + testAddress1

    // ! configure this later

    //let usersNHAddress = req.body.usersNHAddress
    // let nhAddress = addressUrl + usersNHAddress

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

app.get("/api/nh/sevenDayHistory", (req, res) => {
    let myAddress = sevenDayHistory + testAddress
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