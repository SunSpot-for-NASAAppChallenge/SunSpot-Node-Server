var http = require('http');
var queryString = require('querystring');

var requestHeader = require('request');
var port = process.env.PORT || process.env.NODE_PORT || 3000;
var Global = {
    data : null
};


var responseHeaders = {  
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, accept",
    "access-control-max-age": 10,
    "Content-Type": "application/json"
};

//Handles HTTP requests to the server
function onRequest(request, response){
    //Base response fro
    
    //Seperates the query from the rest of the url
    var query = request.url.split('?')[1];

    //Parse the querystring into a JS object of variables and values
    //PARAMS MUST BE ENCODED WITH encodeURIComponent
    var params = queryString.parse(query);
    
    //check to make sure there is a url, sends an error if there isn't
    if(!params.url){
      //write a 400 error code out
      response.writeHead(400, responseHeaders);
      
      //json error message to respond with
      var responseMessage = {
        message: "Missing url parameter in request"
      };
      
      //stringify JSON message and write it to response
      response.write(JSON.stringify(responseMessage));
      console.log("message printed");
      
      //send response
      response.end();
    }
    
    console.dir(params);
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
    console.log("getting from data sources");
    var weatherData = require('../client/fetch-data.js');
    weatherData.fetch.returnResults = getResults;
    weatherData.fetch.setup();
    var data = weatherData.fetch.fetch.bind(weatherData.fetch);
    data();
}


function getResults(results) {
  Global.data = results;
}
