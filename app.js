// Create an empty sensor object as a global 
var sensor = {};

// Where the sensor data is stored
var mSensorDataURL = 'http://80.69.174.27:8080/output/';

// A subscriber's key (other keys are available at http://80.69.174.27:8080/streams/)
sensor.officeKey = "dPjyGN0bx0IDgO000D4lI6leJGK";

sensor.recKey = "GqXO9z3ae9tODKPPPO2YHxw39By";

sensor.officeDone = false;
sensor.recDone = false;

// A bitmap image describing where the sensor is located
sensor.image = "https://evothings.com/demos/dome_pics/IMG_1758.JPG";

app = {}


app.initialize = function() {
    app.getOfficeJSON();
    app.getRecJSON();
    app.index = 0;
}

// Function to retrieve data, placing it in a "response" object
app.getOfficeJSON = function() {
    console.log('Using AJAX via jquery');
    $.ajax({
        url: mSensorDataURL + sensor.officeKey + ".json?gt[timestamp]=now-1day",
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
                sensor.officeData = response[0];
                sensor.officeFullData = response;
                sensor.officeDone = true;
                fillPage();
            }
        }
    });
}

app.getRecJSON = function () {
    console.log('Using AJAX via jquery');
    $.ajax({
        url: mSensorDataURL + sensor.recKey + ".json?gt[timestamp]=now-1day",
        jsonp: "callback",
        cache: true,
        dataType: "jsonp",
        data:
            {
                page: 1
            },
        success: function (response) {
            if (response && response[0]) {
                sensor.recData = response[0];
                sensor.recFullData = response;
                sensor.recDone = true;
                fillPage();
            }
        }
    });
}
    
back = function() {
    if(app.index != sensor.officeFullData.length) {
        app.index = app.index + 10
        fillPage();
    }
}

forward = function() {
    if(app.index === 0) {
        app.index = 0
    } else {
        app.index = app.index - 10
        fillPage()
    }
}

fillPage = function() {
    if(!(sensor.officeDone && sensor.recDone)) {
        return
    }

    var officeData = sensor.officeFullData.slice(app.index, app.index + 10);
    var recData = sensor.recFullData.slice(app.index, app.index+10);


    // Timestamp
    time = document.getElementById("timestamp");
    var date = new Date(officeData[0]["timestamp"]);
    time.innerHTML = date.toDateString();
    
    officeTimestamps = []
    for(time in officeData) {
        officeTimestamps.push(new Date(officeData[time]["timestamp"]).toLocaleTimeString())
    }
    officeTimestamps = officeTimestamps.reverse();

    recTimestamps = []
    for (time in recData) {
        recTimestamps.push(new Date(recData[time]["timestamp"]).toLocaleTimeString())
    }

    recTimestamps = recTimestamps.reverse();


    officeTemps = app.separateArray("t", officeData);
    recTemps = app.separateArray("t", recData);

    

    // Temp

    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: officeTimestamps,
            datasets: [{
                        type: "line",
                        data: officeTemps,
                        fill: false,
                        label: "Temperature Rindö office",
                        backgroundColor: 'rgb(150, 99, 132)',
                        borderColor: 'rgb(150, 99, 132)',
                    },
                    {
                        type: "line",
                        data: recTemps,
                        fill: false,
                        label: "Temperature recreational area",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                    }
            ]
        }
    });
    
    
    // Humidity
    
    
    //
}

app.separateArray = function(label, data) {
    tempArray = []
    for (element in data) {
        tempArray.push(data[element][label])
    }
    tempArray = tempArray.reverse()
    return tempArray;
}


app.initialize();
//document.addEventListener("deviceready", app.initialize(), false);