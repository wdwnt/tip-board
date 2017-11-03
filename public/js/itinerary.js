var Itinerary = (function () {
    var thisDiv;

    function getItinerary() {
        $.ajax({
            url: '/fastpass',
            success: function (data) {
                var itineraryItem = data[0];
                var date = new Date(itineraryItem.startDateTime.replace(" ", "T"));
                var language = window.navigator.language;
                var currentMonthAndDay = date.toLocaleString(language, { month: 'long', day: '2-digit', year: 'numeric' });
                var output = '<strong>Your upcoming events:</strong><br />' +
                    itineraryItem.name + '<br />' +
                    currentMonthAndDay;
                thisDiv.html(output);
            }
        });
    };

    function init(div) {
        thisDiv = div;

        getItinerary();
    };

    return {
        Initialize: init
    };
}());