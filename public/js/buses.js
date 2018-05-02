var Buses = (function () {
    const headers = { "Authorization": "Basic TmV4dEJ1c1VzZXI6V0RXTlRDT05GSVJNRUQxOTcx" };
    var thisDestination, thisResortId, thisBusStopId, thisTimeZoneApiKey, thisLatitude, thisLongitude;
    var parkHoursData = [];
    var currentParkIndex = 0;

    function getCurrentTime() {
        if (thisTimeZoneApiKey === undefined || thisTimeZoneApiKey === '') {
            return;
        } else {
            var timezoneUrl = 'https://api.timezonedb.com/v2/get-time-zone?key=' + thisTimeZoneApiKey +
                '&by=position&lat=' + thisLatitude + '&lng=' + thisLongitude + '&format=json';

            $.ajax({
                url: timezoneUrl,
                success: function (data) {

                    var date = new Date(data.formatted.replace(" ", "T"));
                    var language = window.navigator.language;

                    var currentDayOfWeek = date.toLocaleString(language, { weekday: 'long' });
                    var currentMonthAndDay = date.toLocaleString(language, { month: 'long', day: '2-digit' });
                    $('#current-date').html(currentDayOfWeek + ' ' + currentMonthAndDay);

                    $('#current-time').html(date.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' }));
                }
            });
        }
    };

    function getWeather() {
        $.ajax({
            url: 'https://wdwntnowapi.azurewebsites.net/api/v2/weather/' + thisDestination,
            success: function (data) {
                var today = data.forecasts[0];
                var tomorrow = data.forecasts[1];

                var weather_today = '<div class="weather-header">Today</div>' + 
                    today.high + '&deg;F and ' + 
                    today.text.toLowerCase();
                var weather_tomorrow = '<div class="weather-header">Tomorrow</div>' + 
                    tomorrow.high + '&deg;F and ' + 
                    tomorrow.text.toLowerCase();
                $('#weather-today').html(weather_today);
                $('#weather-tomorrow').html(weather_tomorrow);
            }
        });
    };

    function getParkHours() {
        $.ajax({
            url: 'https://wdwntnowapi.azurewebsites.net/api/v2/mobile/parks/' + thisDestination,
            success: function (data) {
                updateParkHoursData(data);
            }
        });
    };

    function cleanUpParkHours(hours) {
        return hours.replace(' + Special Event', '<br /><strong>Special Event</strong>')
            .replace(' with EMH: ', '<br /><strong>Extra Magic Hours</strong><br />');
    }

    function updateParkHoursData(data) {
        $('#mk').css('background-image', 'url("' + data[0].imageUrl + '")');
        $('#mk .park-hours').html(cleanUpParkHours(data[0].todaysHours));

        $('#ep').css('background-image', 'url("' + data[1].imageUrl + '")');
        $('#ep .park-hours').html(cleanUpParkHours(data[1].todaysHours));

        $('#hs').css('background-image', 'url("https://wdwntnow.oseast-us-1.phoenixnap.com/images/theme-park/80007998/01.jpg")');
        $('#hs .park-hours').html(cleanUpParkHours(data[2].todaysHours));

        $('#ak').css('background-image', 'url("' + data[3].imageUrl + '")');
        $('#ak .park-hours').html(cleanUpParkHours(data[3].todaysHours));

        $('#ds').css('background-image', 'url("' + data[4].imageUrl + '")');
        $('#ds .park-hours').html(cleanUpParkHours(data[4].todaysHours));

        $('#tl').css('background-image', 'url("' + data[5].imageUrl + '")');
        $('#tl .park-hours').html(cleanUpParkHours(data[5].todaysHours));

        $('#bb').css('background-image', 'url("' + data[6].imageUrl + '")');
        $('#bb .park-hours').html(cleanUpParkHours(data[6].todaysHours));
    };

    function getBusTimes() {
        var bus_url = 'https://wdwntfunctions.azurewebsites.net/api/BusWaitTimes?' +
            'resortId=' + thisResortId +
            '&busStopId=' + thisBusStopId;

        $.ajax({
            headers: headers,
            url: bus_url,
            success: function (data) {
                updateBusTimes(data);
            }
        });
    }

    function formatBusTime(bus_time) {
        var data = bus_time.at_stop ? bus_time.at_stop : bus_time.message;
        return 'Next bus<div class="bus-message">' + data + '</div>';
    }

    function updateBusTimes(data) {
        $('#mk .bus-time').html(formatBusTime(data[0]));
        $('#ep .bus-time').html(formatBusTime(data[1]));
        $('#hs .bus-time').html(formatBusTime(data[2]));
        $('#ak .bus-time').html(formatBusTime(data[3]));
        $('#ds .bus-time').html(formatBusTime(data[4]));
        $('#tl .bus-time').html(formatBusTime(data[5]));
        $('#bb .bus-time').html(formatBusTime(data[6]));
    }

    function getBusStopInformation() {
        var stop_url = 'https://wdwntnowapi.azurewebsites.net/api/v2/transportation/busstop/' + thisBusStopId;
        $.ajax({
            url: stop_url,
            success: function (data) {
                var bus_stop_name = data.shortName ? data.shortName : data.name;
                $('#bus-stop-name').html(bus_stop_name);
            }
        });
    }

    function init(destination, resortId, busStopId, timeZoneApiKey, latitude, longitude) {
        thisDestination = destination;
        thisResortId = resortId;
        thisBusStopId = busStopId;
        thisTimeZoneApiKey = timeZoneApiKey;
        thisLatitude = latitude;
        thisLongitude = longitude;

        getCurrentTime();
        getWeather();
        getParkHours();
        getBusTimes();
        getBusStopInformation();

        setInterval(getCurrentTime, 30000);
        setInterval(getWeather, 600000);
        setInterval(getParkHours, 3600000);
		setInterval(getBusTimes, 300000);
    };

    return {
        Initialize: init
    };
}());