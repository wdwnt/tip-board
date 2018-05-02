var express = require('express');
var app = express();
var request = require('request-promise');
var facilities = require('./facilities');

app.set('view engine', 'ejs');
app.use('/static', express.static(__dirname + '/public'));

var time_zone_api_key = process.env.time_zone_api_key || '';

app.get('/', function (req, res) {
    res.render('index_tipboard', {
        destination: 'wdw',
        timeZoneApiKey: time_zone_api_key,
        latitude: 28.4160036778,
        longitude: -81.5811902834
    });
});

app.get('/tipboard/wdw', function (req, res) {
    res.render('index_tipboard', {
        destination: 'wdw',
        timeZoneApiKey: time_zone_api_key,
        latitude: 28.4160036778,
        longitude: -81.5811902834
    });
});

app.get('/tipboard/dlr', function (req, res) {
    res.render('index_tipboard', {
        destination: 'dlr',
        timeZoneApiKey: time_zone_api_key,
        latitude: 33.8095545068,
        longitude: -117.9189529669
    });
});

app.get('/tipboard/tdr', function (req, res) {
    res.render('index_tipboard', {
        destination: 'tdr',
        timeZoneApiKey: time_zone_api_key,
        latitude: 35.6329,
        longitude: 139.8804
    });
});

app.get('/tipboard/dlp', function (req, res) {
    res.render('index_tipboard', {
        destination: 'dlp',
        timeZoneApiKey: time_zone_api_key,
        latitude: 48.870205,
        longitude: 2.779913
    });
});

app.get('/tipboard/hkdl', function (req, res) {
    res.render('index_tipboard', {
        destination: 'hkdl',
        timeZoneApiKey: time_zone_api_key,
        latitude: 22.313131,
        longitude: 114.044517
    });
});

app.get('/tipboard/shdr', function (req, res) {
    res.render('index_tipboard', {
        destination: 'shdr',
        timeZoneApiKey: time_zone_api_key,
        latitude: 31.147097966725,
        longitude: 121.66901898194
    });
});

app.get('/buses/wdw/:resortId?/:busStopId?', function (req, res) {
    var resortId = req.params.resortId || 80010397;
    var busStopId = req.params.busStopId || 19893;

    res.render('index_buses', {
        destination: 'wdw',
        resortId,
        busStopId,
        timeZoneApiKey: time_zone_api_key,
        latitude: 28.4160036778,
        longitude: -81.5811902834
    });
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
                url: 'https://api.wdpro.disney.go.com/reservation-service/itinerary-items/' + token.swid + '?guest-locators=' + process.env.mdx_xid + '%3Btype%3Dxid&item-types=RESORT&item-types=DINING&item-types=FASTPASS&item-types=NON_BOOKABLE&item-types=PERSONAL_SCHEDULE&start-date=2017-11-02&end-date=2018-11-02&guest-role=PARTICIPANT&destination=WDW',
                headers: {
                    'Authorization': 'Bearer ' + token.access_token
                }
            };

            request(fpRequest)
                .then(function (fpResponse) {
                    var fpResponseItems = JSON.parse(fpResponse).items;
                    var items = [];

                    for (var i = 0; i < fpResponseItems.length; i++) {
                        var current_item = fpResponseItems[i];
                        var itinerary_item = {};
                        if (current_item.type === "RESORT") {
                            itinerary_item = buildResort(current_item);
                        } else if (current_item.type === "FASTPASS") {
                            itinerary_item = buildFastPass(current_item);
                        } else if (current_item.type === "DINING") {
                            itinerary_item = buildDining(current_item);
                        }

                        updateFacilityInfo(itinerary_item);
                        items.push(itinerary_item);
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

function buildResort(item) {
    return {
        id: parseInt(item.accommodations[0].facility.split(';')[0]),
        name: '',
        startDateTime: item.startDateTime,
        endDateTime: item.endDateTime,
        type: 'resort'
    };
}

function buildFastPass(item) {
    return {
        id: parseInt(item.facility.split(';')[0]),
        name: '',
        startDateTime: item.startDateTime,
        endDateTime: item.endDateTime,
        type: item.facility.split('=')[1]
    };
}

function buildDining(item) {
    return {
        id: parseInt(item.asset.split(';')[0]),
        name: '',
        startDateTime: item.startDateTime,
        type: item.asset.split('=')[1]
    };
}

function updateFacilityInfo(item) {
    for (var i = 0; i < facilities.length; i++) {
        if (facilities[i].id === item.id) {
            item.name = facilities[i].name;
        }
    }
}

app.listen(process.env.port || 8000);
