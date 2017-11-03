var TipBoard = (function () {
    var thisAudioPlayer, thisDestination, thisTimeZoneApiKey, latitude, longitude;
    var baseMp3Url = 'https://wdwntnow.oseast-us-1.phoenixnap.com/music/today_at_wdw/';
    var songIndex = 1;
    var parkHoursData = [];
    var currentParkIndex = 0;

    function buildSongUrl() {
        return baseMp3Url + songIndex + '.mp3';
    }

    function setupAudioPlayer() {
        var audioPlayer = document.getElementById('audio-player');
        audioPlayer.setAttribute('src', buildSongUrl());
        audioPlayer.addEventListener('ended', function () {
            songIndex++;
            if (songIndex > 16) {
                songIndex = 1;
            }

            audioPlayer.src = buildSongUrl();
            audioPlayer.load();
            audioPlayer.play();
        }, false);
    }

    function getCurrentTime() {
        if (thisTimeZoneApiKey === undefined || thisTimeZoneApiKey === '') {
            return;
        } else {
			
			var timezoneUrl = 'https://api.timezonedb.com/v2/get-time-zone?key=' + thisTimeZoneApiKey + '&by=position&lat=' + latitude + '&lng=' + longitude + '&format=json';
			
            $.ajax({
                url: timezoneUrl,
                success: function (data) {
					
                    var date = new Date(data.formatted);
                    var language = window.navigator.language;
					
                    var currentDayOfWeek = date.toLocaleString(language, { weekday: 'long' });
                    var currentMonthAndDay = date.toLocaleString(language, { month: 'long', day: '2-digit' });
                    $('#current-date').html(currentDayOfWeek + '<br />' + currentMonthAndDay);

                    $('#current-time').html(date.toLocaleTimeString(language, { hour: '2-digit', minute: '2-digit' }));
                }
            });
        }
    }

    function getWeather() {
        $.ajax({
            url: 'https://wdwntnowapi.azurewebsites.net/api/v2/weather/' + thisDestination,
            success: function (data) {
                var weather = 'Currently ' + data.temp + '&deg;F (' +
                    data.tempCelsius + '&deg;C) and ' + data.text.toLowerCase();
                $('#current-weather').html(weather);
            }
        });
    }

    function getParkHours() {
        $.ajax({
            url: 'https://wdwntnowapi.azurewebsites.net/api/v2/mobile/parks/' + thisDestination,
            success: function (data) {
                updateParkHoursData(data);
                getCurrentTime();
            }
        });
    }

    function updateParkHoursData(data) {
        parkHoursData = data;
        latitude = data[0].latitude;
        longitude = data[0].longitude;

        var output = '';

        $.each(data, function (index, park) {
            output += '<div class="info park">';
            output += '<h3>' + park.name + '</h3>';
            output += '<h4>' + park.todaysHours + '</h4>';
        });

        $('#parks').html(output);
    }

    function updateMainContent() {
        currentParkIndex++;
        if (currentParkIndex >= parkHoursData.length) {
            currentParkIndex = 0;
        }

        var currentPark = parkHoursData[currentParkIndex];
        document.body.style.backgroundImage = 'url(' + currentPark.imageUrl + ')';
        $('#park-name').html(currentPark.name);
        $('#todays-park-hours-label').show();
        $('#hours').html(currentPark.todaysHours);
    }

    function init(audioPlayer, destination, timeZoneApiKey) {
        thisAudioPlayer = audioPlayer;
        thisDestination = destination;
        thisTimeZoneApiKey = timeZoneApiKey;

        setupAudioPlayer();
        getWeather();
        getParkHours();

        setInterval(getCurrentTime, 30000);
        setInterval(getWeather, 600000);
        setInterval(getParkHours, 3600000);
        setInterval(updateMainContent, 10000);
    };

    return {
        Initialize: init
    };
}());