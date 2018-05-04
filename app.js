// Create an empty sensor object as a global 
var sensor = {};

// Where the sensor data is stored
var mSensorDataURL = 'http://80.69.174.27:8080/output/';

// A subscriber's key (other keys are available at http://80.69.174.27:8080/streams/)
sensor.key = "GqXO9z3ae9tODKPPPO2YHxw39By";

// A bitmap image describing where the sensor is located
sensor.image = "https://evothings.com/demos/dome_pics/IMG_1758.JPG";


// Function to retrieve data, placing it in a "response" object
function getJSON() 
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
                                printData();
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
                                    printData();
                                }
                        }
                });
        }
}


function printData()    
    {
        if (sensor && sensor.data) 
            {
            // Display the info.
                html = '<h1>Sensor Data</h1>'
                 + '<br /><div id="time">Time  ' + sensor.data.timestamp + '</div>'
                 + '<div id="hum">Humidity ' + sensor.data.h + ' % (rel)</div>'
                 + '<div id="temp">Temperature ' + sensor.data.t + ' celcius</div>'
                 + '<img src="' + sensor.image + '" />'
            } 
    else 
            {
                html = '<h1>Sensor Data</h1>'
                 + '<br />Sorry, sensor data not available right now :(</br>'
                 + '<img src="' + sensor.image + '" />'
            }
    document.getElementById("printHere").innerHTML= html;
}

