var http = require('http');
var queryString = require('querystring');

var requestHeader = require('request');
var port = process.env.PORT || process.env.NODE_PORT || 3000;
var Global = {
    data : {}
};


var shortid = require("shortid");

var responseHeaders = {  
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, accept",
    "access-control-max-age": 10,
    "Content-Type": "application/json"
};

//Handles HTTP requests to the server
function onRequest(request, response){
    if(request.url == "/favicon.ico"){
        return;
    }
    
    //Seperates the query from the rest of the url
    var query = request.url.split('?')[1];

    //Parse the querystring into a JS object of variables and values
    //PARAMS MUST BE ENCODED WITH encodeURIComponent
    var params = queryString.parse(query);
    
    //console.dir(params);
    try{
        console.dir(params.action);
        var actionMissing = !(params.action);
        var zipcodeMissing = !(params.zipcode);
        console.log("Zip = " + params.zipcode);
        //console.log(zipcodeMissing);
        if(actionMissing){
            //console.log("Failure!");
            //throw a bad request error
            response.writeHead(400, responseHeaders);
            
              //json error message to respond with
              var responseMessage = {
                  message: "Please, include an action parameter."
              };
            
              //stringify JSON message and write it to response
              response.write(JSON.stringify(responseMessage));
            
              //send response
              response.end();
              
              return;
        }
        //console.log("Success!");
        var zip = zipcodeMissing?14612:params.zipcode;
        
        console.dir(Global.data);
        switch(params.action){
            case "retrieve":
                var count = 0;
                
                response.writeHead(200, responseHeaders);
                
                var index = parseInt(zip);
                var data = Global.data[index];
                //console.log("index = " + index);
                console.log(data);
                
                var uid = shortid.generate();
                var date = new Date();
                
                var msg = "SunSpot brings you your beach report.";
                
                msg += " The air temperature is " + Math.round(data.air_temp) + " degrees Fahrenheit.";
                if(data.air_temp > 70){
                    msg += " Perfect!";
                    count++;
                } else{
                    msg += " It may be too cold for swimming."
                }
                
                /*
                msg += " The water temperature is " + data.water_temp + "degrees Fahrenheit.";
                if(data.water_temp > 70){
                    msg += " Enjoy the water.";
                    count++;
                } else{
                    msg += " It may be too cold for swimming."
                }*/
                
                msg += " The cloud cover is " + data.clouds.all + " percent.";
                if(data.clouds.all < 50){
                    msg += " Nice and sunny.";
                    count++;
                } else{
                    msg += " You might not be able to get a tan.";
                }
                
                msg += " The wind is blowing at " + Math.round(data.wind.speed) + " miles per hour from " + data.wind.deg + " degrees from the North";
                
                //creates the response object
                var responseMessage = {
                    uid: uid,
                    date: date.toISOString(),
                    titleText: "SunSpot's Beach Report for " + date.toDateString(),
                    mainText: msg,
                    redirectionURL: "https://notiesoftware.com/sunspot"
                }
                //console.dir(response);
                
                //writes the response
                response.write(JSON.stringify(responseMessage));
                
                //sends the response
                response.end();
                break;
            default:
                response.writeHead(400, responseHeaders);
                
                var responseMessage = {
                    message: "This is not a valid action. Possible actions are: retrieve."
                }
                
                response.write(JSON.stringify(responseMessage));
                
                response.end();
                break;
        }
        return;
    }
    catch(exception){
        response.writeHead(500, responseHeaders);
        
        var responseMessage = {
            message: (exception.name + " - " + exception.message)
        }
        
        response.write(JSON.stringify(responseMessage));
                
        response.end();
        
        return;
    }
}
//Creates a server to listen for requests
const server = http.createServer(onRequest);
server.listen(port);
var later = require('later');
var sched = later.parse.recur().every(1).minute();
later.date.UTC();
var getData = later.setInterval(getDataFromSources,sched);
getDataFromSources()

function getDataFromSources() {
    //console.log("getting from data sources");
    var locations = require('../client/fetch-data.js').locations;
    var weatherData = require('../client/fetch-data.js');
    for(var i=0 ; i<locations.length ; i++ ) {
        //console.log("--"+i)
        weatherData.fetch.returnResults = getResults;
        weatherData.fetch.setup(i);
        var zip = weatherData.fetch.location.zipcode
        //console.log(zip);
        var data = weatherData.fetch.fetch.bind(weatherData.fetch);
        data(i);
    }
}


function getResults(results,location) {
    console.log("~ "+JSON.stringify(location.zipcode));
    Global.data[location.zipcode]= results;
}
