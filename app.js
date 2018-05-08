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
    getJSON();
    app.index = 0;
    fillpage();
}


// Function to retrieve data, placing it in a "response" object
function getJSON(daysback) 
    {
    if (window.cordova) 
        {
            console.log('Using Apache Cordova HTTP GET function');
            cordovaHTTP.get(
                mSensorDataURL + sensor.key + '.json?gt[timestamp]=now-1day&page=1',
                function (response) 
                    {
                        if (response) 
                            {
                                sensor.data = JSON.parse(response.data)[0];
                                sensor.fullData = JSON.parse(response.data);
                            }
                    },
                function (error) 
                    {
                    console.log(JSON.stringify(error));
                    });
        }    
    else 
        {
            console.log('Not using Cordova, fallback to AJAX via jquery');
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
                                }
                        }
                });
        }
}

back = function() {
    if(app.index != sensor.fullData.length) {
        app.index = app.index + 1
        fillpage();
    }
}

forward = function() {
    if(app.index === 0) {
        app.index = 0;
    } else (
        app.index = app.index - 1;
        fillpage()
    )
}

fillPage = function() {
    
}




app.initialize();