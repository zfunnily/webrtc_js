'use strict'

var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('./cert/privatekey.pem'),
    cert: fs.readFileSync('./cert/certificate.pem')
}

app.use('/', express.static('./public'));

var httpServer = http.createServer(app).listen(8887, function() {
        console.log('HTTP Server is running on: http://localhost:%s', 8887);
    });

var httpsServer = https.createServer(options, app)
    .listen(8888, function() {
        console.log('HTTPS Server is running on: http://localhost:%s', 8888);
    });


//可以根据请求判断是http还是https
app.get('/', function (req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('This is https visit!');
    }
    else {
        res.status(200).send('This is http visit!');
    }
});

