var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

var time_zone_api_key = process.env.time_zone_api_key || '';

app.get('/', function (req, res) {
    res.render('index_wdw', { timeZoneApiKey: time_zone_api_key });
});

app.get('/wdw', function (req, res) {
    res.render('index_wdw', { timeZoneApiKey: time_zone_api_key });
});

app.get('/dlr', function (req, res) {
    res.render('index_dlr', { timeZoneApiKey: time_zone_api_key });
});

app.get('/tdr', function (req, res) {
    res.render('index_tdr', { timeZoneApiKey: time_zone_api_key });
});

app.get('/dlp', function (req, res) {
    res.render('index_dlp', { timeZoneApiKey: time_zone_api_key });
});

app.get('/hkdl', function (req, res) {
    res.render('index_hkdl', { timeZoneApiKey: time_zone_api_key });
});

app.get('/shdr', function (req, res) {
    res.render('index_shdr', { timeZoneApiKey: time_zone_api_key });
});

app.listen(process.env.port || 8000);
