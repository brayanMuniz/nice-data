const express = require('express');
const bodyParser = require('body-parser')
const axios = require('axios')
var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


function getAddressNiceHashData() {
    axios.get('https://api.nicehash.com/api')
        .then(response => {
            // console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error);
        });
}

app.get("/api", (req, res) => {
    let response = getAddressNiceHashData()
    res.send(req.body)
})

app.get("/api/portfolio", (req, res) => {
    res.send("Hi")
})

app.get("/api/about", (req, res) => {
    res.send("About")
})

app.listen(port);