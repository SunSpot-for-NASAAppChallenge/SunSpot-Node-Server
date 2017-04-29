var http = require('http');
var queryString = require('querystring');

var requestHeader = require('request');
var port = process.env.PORT || process.env.NODE_PORT || 3000;

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
    
    console.dir(request.url);
    console.dir(params);
    
    //console.dir(params);
    try{
        console.dir(params.action);
        var actionMissing = !(params.action);
        console.log(actionMissing);
        if(actionMissing){
            console.log("Failure!");
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
        console.log("Success!");
        
        switch(params.action){
            case "retrieve":
                
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
    }
    catch(exception){
        
    }
}

//Creates a server to listen for requests
http.createServer(onRequest).listen(port);