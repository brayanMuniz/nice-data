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
// TODO REFACTOR THIS SO YOU JUST HAVE TO PASS IN QUERY NOT CALL MULTIPLE ROUTES YOU IDIOT
// Get current stats for provider for all algorithms. Refreshed every 30 seconds. It also returns past 56 payments.
let addressUrl = "https://api.nicehash.com/api?method=stats.provider&addr="
// Past 7 days worth of allgorithims and payments
let sevenDayHistory = "https://api.nicehash.com/api?method=stats.provider.ex&addr="
// Get payments for provider.
let paymentHistory = "https://api.nicehash.com/api?method=stats.provider.payments&addr="
// Workers (rigs)
let workers = "https://api.nicehash.com/api?method=stats.provider.workers&addr="

app.get("/api/nh", (req, res) => {
    let totalUrl = `https://api.nicehash.com/api?method=${req.query.method}&addr=${req.query.addr}`
    console.log(totalUrl)
    axios.get(totalUrl)
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