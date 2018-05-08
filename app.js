// Create an empty sensor object as a global 
var sensor = {};

// Where the sensor data is stored
var mSensorDataURL = 'http://80.69.174.27:8080/output/';

// A subscriber's key (other keys are available at http://80.69.174.27:8080/streams/)
sensor.key = "GqXO9z3ae9tODKPPPO2YHxw39By";

// A bitmap image describing where the sensor is located
sensor.image = "https://evothings.com/demos/dome_pics/IMG_1758.JPG";

app = {}


app.initialize = function() {
    app.getJSON();
    app.index = 0;
}


// Function to retrieve data, placing it in a "response" object
app.getJSON = function() {
    console.log('Using AJAX via jquery');
    $.ajax({
        url: mSensorDataURL + sensor.key + ".json?gt[timestamp]=now-1day",
        jsonp: "callback",
        cache: true,
        dataType: "jsonp",
        data: 
        {
            page: 1
        },
        success: function(response) 
        {
            if (response && response[0]) 
            {
                sensor.data = response[0];
                sensor.fullData = response;
                fillPage();
            }
        }
    });
}
    
back = function() {
    if(app.index != sensor.fullData.length) {
        app.index = app.index + 1
        fillPage();
    }
}

forward = function() {
    if(app.index === 0) {
        app.index = 0
    } else {
        app.index = app.index - 1
        fillPage()
    }
}

fillPage = function() {
    var currentData = sensor.fullData[app.index];

    // Timestamp
    time = document.getElementById("timeHeader");
    var date = new Date(currentData["timestamp"]);
    time.innerHTML = date.toUTCString();
    
    // Temperature
    
    
    // Humidity
    
    
    //
}

app.initialize();
//document.addEventListener("deviceready", app.initialize(), false);