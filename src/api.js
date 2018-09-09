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
    axios.get(url)
        .then(function (resopnse) {
            return response.data
        })
        .catch(error => {
            console.log(error);
        });
}

app.get("/api", (req, res) => {
    axios.get('https://api.nicehash.com/api')
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

app.get("/api/portfolio", (req, res) => {
    res.send("Hi")
})

app.get("/api/about", (req, res) => {
    res.send("About")
})

app.listen(port);