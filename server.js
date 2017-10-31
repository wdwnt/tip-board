var express = require('express');
var app = express();
var path = require('path');

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index_wdw.html');
});

app.get('/wdw', function (req, res) {
    res.sendFile(__dirname + '/public/index_wdw.html');
});

app.get('/dlr', function (req, res) {
    res.sendFile(__dirname + '/public/index_dlr.html');
});

app.get('/tdr', function (req, res) {
    res.sendFile(__dirname + '/public/index_tdr.html');
});

app.get('/dlp', function (req, res) {
    res.sendFile(__dirname + '/public/index_dlp.html');
});

app.get('/hkdl', function (req, res) {
    res.sendFile(__dirname + '/public/index_hkdl.html');
});

app.get('/shdr', function (req, res) {
    res.sendFile(__dirname + '/public/index_shdr.html');
});

app.listen(8000);
