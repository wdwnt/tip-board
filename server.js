var express = require('express');
var app = express();
var request = require('request-promise');

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

app.get('/fastpass', function (req, res) {
    var formToPost = {
        BEARER: 'WDPRO-MOBILE.MDX.WDW.ANDROID-PROD',
        username: process.env.mdx_username,
        password: process.env.mdx_password,
        grant_type: 'password',
        client_id: 'TPR-WDW.AND-PROD',
        scope: 'RETURN_ALL_CLIENT_SCOPES'
    };

    var authOptions = {
        url: 'https://authorization.go.com/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: formToPost
    };

    request(authOptions)
        .then(function (response) {
            var token = JSON.parse(response)
            var fpRequest = {
                url: 'https://api.wdpro.disney.go.com/reservation-service/itinerary-items/' + token.swid + '?guest-locators=' + process.env.mdx_xid + '%3Btype%3Dxid&item-types=RESORT&item-types=DINING&item-types=FASTPASS&item-types=NON_BOOKABLE&item-types=PERSONAL_SCHEDULE&start-date=2017-11-02&end-date=2018-11-02&guest-role=PARTICIPANT&guest-locator-groups=MY_FAMILY&destination=WDW',
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                }
            };

            request(fpRequest)
                .then(function (fpResponse) {
                    var fpResponseItems = JSON.parse(fpResponse).items;
                    var items = [];

                    for (var i = 0; i < fpResponseItems.length; i++) {
                        var currentItem = fpResponseItems[i];
                        if (currentItem.type === "RESORT") {
                            items.push({ facility: currentItem.accommodations[0].facility });
                        } else if (currentItem.type === "FASTPASS") {
                            items.push({ facility: currentItem.facility });
                        }
                    }

                    res.send(items);
                });
        }).catch(function (error) {
            res.send({
                status: error.statusCode,
                body: error.error
            });
        });
});

app.listen(process.env.port || 8000);
