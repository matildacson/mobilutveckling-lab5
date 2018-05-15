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
        url: mSensorDataURL + sensor.officeKey + ".json?gt[timestamp]=now-20day&lt[timestamp]=now-0day",
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
                console.log("fill 1");
                fillPage();
            }
        }
    });
}

app.getRecJSON = function () {
    console.log('Using AJAX via jquery');
    $.ajax({
        url: mSensorDataURL + sensor.recKey + ".json?gt[timestamp]=now-20day&lt[timestamp]=now-0day",
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
                console.log("fill 2 " + sensor.recFullData.length);
                fillPage();
            }
        }
    });
}
    
back = function() {
    if(app.index != sensor.recFullData.length) {
        app.index = app.index + 24
        fillPage();
    }
}

forward = function() {
    if(app.index === 0) {
        app.index = 0
    } else {
        app.index = app.index - 24
        fillPage()
    }
}

fillPage = function() {
    console.log("fillpage starting");
    if(!(sensor.officeDone && sensor.recDone)) {
        return
    }

    var officeData = [];
    var recData = [];

    var previousHour = new Date(sensor.officeFullData[app.index]["timestamp"]).getHours();
    officeData.push(sensor.officeFullData[app.index]);
    for(data in sensor.officeFullData) {
        var currentHour = new Date(sensor.officeFullData[data]["timestamp"]).getHours();
        if (currentHour != previousHour) {
            previousHour = currentHour;
            officeData.push(sensor.officeFullData[data]);
        }
    }

    var previousHour = new Date(sensor.recFullData[app.index]["timestamp"]).getHours();
    recData.push(sensor.recFullData[app.index]);
    for (data in sensor.recFullData) {
        var currentHour = new Date(sensor.recFullData[data]["timestamp"]).getHours();
        console.log("prev" + previousHour);
        console.log("current" + currentHour)
        if (currentHour != previousHour) {
            previousHour = currentHour;
            recData.push(sensor.recFullData[data]);
        }
    }

    officeData = officeData.slice(app.index, app.index + 24);
    recData = recData.slice(app.index, app.index + 24);

    // Timestamp
    time = document.getElementById("timestamp");
    try {
        var date = new Date(officeData[0]["timestamp"]);
        time.innerHTML = date.toDateString();
    } catch (error) {
        time.innerHTML = "No data " + app.index;
    }
    
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


    
    // Temp
    officeTemps = app.separateArray("t", officeData);
    recTemps = app.separateArray("t", recData);

    var ctx = document.getElementById('tempChart').getContext('2d');
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
    officeHum = app.separateArray("h", officeData);
    recHum = app.separateArray("h", recData);

    var humctx = document.getElementById('humChart').getContext('2d');
    var humChart = new Chart(humctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: officeTimestamps,
            datasets: [{
                type: "line",
                data: officeHum,
                fill: false,
                label: "Humidity Rindö office",
                backgroundColor: 'rgb(150, 99, 132)',
                borderColor: 'rgb(150, 99, 132)',
            },
            {
                type: "line",
                data: recHum,
                fill: false,
                label: "Humidity recreational area",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
            }
            ]
        }
    });
    
    // Lumens
    officeLum = app.separateArray("l", officeData);
    recLum = app.separateArray("l", recData);

    var lumctx = document.getElementById('lumChart').getContext('2d');
    var lumChart = new Chart(lumctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: officeTimestamps,
            datasets: [{
                type: "line",
                data: officeLum,
                fill: false,
                label: "Lumens Rindö office",
                backgroundColor: 'rgb(150, 99, 132)',
                borderColor: 'rgb(150, 99, 132)',
            },
            {
                type: "line",
                data: recLum,
                fill: false,
                label: "Lumens recreational area",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
            }
            ]
        }
    });

    // Cardbon dioxide
    officeCar = app.separateArray("c", officeData);
    recCar = app.separateArray("c", recData);

    var carctx = document.getElementById('carChart').getContext('2d');
    var carChart = new Chart(carctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: officeTimestamps,
            datasets: [{
                type: "line",
                data: officeCar,
                fill: false,
                label: "Carbon dioxide Rindö office",
                backgroundColor: 'rgb(150, 99, 132)',
                borderColor: 'rgb(150, 99, 132)',
            },
            {
                type: "line",
                data: recCar,
                fill: false,
                label: "Carbon dioxide recreational area",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
            }
            ]
        }
    });

    // Pressure
    officePre = app.separateArray("p", officeData);
    recPre = app.separateArray("p", recData);

    var prectx = document.getElementById('preChart').getContext('2d');
    var preChart = new Chart(prectx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: officeTimestamps,
            datasets: [{
                type: "line",
                data: officePre,
                fill: false,
                label: "Pressure Rindö office",
                backgroundColor: 'rgb(150, 99, 132)',
                borderColor: 'rgb(150, 99, 132)',
            },
            {
                type: "line",
                data: recPre,
                fill: false,
                label: "Pressure recreational area",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
            }
            ]
        }
    });



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