var http = require('http');
var queryString = require('querystring');

var requestHeader = require('request');
var report = process.env.PORT || process.env.NODE_PORT || 3000;

var responseHeaders = {  
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "Content-Type, accept",
    "access-control-max-age": 10,
    "Content-Type": "application/json"
};

//Handles HTTP requests to the server
function onRequest(request, response){
    
}