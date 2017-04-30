/**
 * fetch-data.js
 * (C) 2017 by Brian Sandon (bxs9775@rit.edu)
 * Released under GPL-3.0
**/

"use strict";


var Data = {};

var app = app || {};


app.locations = [
    {
        city: "Rochester",
        state: "NY",
        country: "us",
        zipcode: "14612",
        noaa_station: "9052058"
    },
    {
        city: "Beverly Hills",
        state: "NY",
        country: "us",
        zipcode: "90210",
        noaa_station: "9052058"
    },
    {
        city: "Boston",
        state: "MA",
        country: "us",
        zipcode: "02134",
        noaa_station: "9052058"
    },
    {
        city: "Melborne",
        state: "FL",
        country: "us",
        zipcode: "32901",
        noaa_station: "9052058"
    },
];

app.fetch = {
    ///////////////////////FIELDS///////////////////////
    location: undefined,
    //Lists all the sites we are getting data from
    //For each site there are the following parameters:
    //  dataType - what the data is being returned as
    //  url - the url of the site
    //  format - a format string for the site. Different elements are seperated by spaces, variables are in brackets.
    //      (accepted variables: [url], [city])
    //  callback - the callback methods for the function
    sites: Object.seal({
        weather: Object.seal({
            dataType: "jsonp",
            url:"http://api.openweathermap.org/data/2.5/weather?zip=",
            format: "[url] [zipcode] , [country] &appid= [key] &units=imperial",
            callback: undefined, //This must be set in setup
            key: "eae1d0e8e3975649ee03a83327f96fcf"
        }),
        tidesAndCurrents: Object.seal({
            dataType: "jsonp",
            url: "https://tidesandcurrents.noaa.gov/api/datagetter?date=today&station=",
            format: "[url] [station] &product=water_level&datum=STND&units=metric&time_zone=gmt&application=web_services&format=json",
            callback: undefined
        })
    }),
    
    
    result: function(){
        this.air_temp = undefined;
        this.water_temp = undefined;
        this.wind = undefined;
        this.clouds = undefined;
        this.clear = function(){
            this.air_temp = undefined;
            this.water_temp = undefined;
            this.wind = undefined;
            this.clouds = undefined;
        };
    },
    results: {},
    numItemsLoaded: 0,
    itemsExpected: 2,
    
    //Function pointer for when the program is done loading
    returnResults: undefined,
    
    ///////////////////////METHODS///////////////////////
    //Completes any initialization for the project
    setup: function(index){
        this.index = index;
        //console.log(this.index);
        this.location = Object.seal(app.locations[index])
        this.sites.weather.callback = this.processWeather.bind(this);
        this.sites.tidesAndCurrents.callback = this.processTides.bind(this);
        
        var numLocations = app.locations.length;
        for(var i = 0;i < numLocations;i++){
            this.results[app.locations[i].zipcode] = new this.result();
        }
    },
    
    //Fetches the data for the project
    fetch: function(index){
        var loc = app.locations[index];
        //console.dir(this);
        this.reset(loc);
        
        this.retrieveData(this.sites.weather,loc);
        this.retrieveData(this.sites.tidesAndCurrents,loc);
    },
    
    //Clears result and numItemsLoaded
    reset: function(loc){
        if(this.results[loc.zipcode]){
           this.results[loc.zipcode].clear();
        }
        this.numItemsLoaded = 0;
    },
    
    ///////////////////////API FETCHES///////////////////////
    //Retrieves data from a given site
    retrieveData: function(site,location){
        //console.dir(site);
        //console.dir(location);
        
        var url = "";
        var elements = site.format.split(" ");
        for(var i = 0; i < elements.length;i++){
            switch(elements[i]){
                case "[url]":
                    url += site.url;
                    break;
                case "[city]":
                    url += location.city;
                    break;
                case "[country]":
                    url += location.country;
                    break;
                case "[zipcode]":
                    url += location.zipcode;
                    break;
                case "[station]":
                    url += location.noaa_station;
                    break;
                case "[key]":
                    url += site.key;
                    break;
                default:
                    url += elements[i];
                    break;
            }
        }
        
        var callback = (site.callback?site.callback:this.dataLoaded).bind(app.fetch);
        
        var request = require('request')
        //console.log(url);
        request(url, function(err,res, body) {
            //console.log(err);
            //console.log(body);
            var jsonToReturn = JSON.parse(body)
            callback(jsonToReturn,location);
        });
        
        // var $ = require('jquery');
        // $.ajax({
            // dataType: site.dataType,
            // url: url,
            // data: null,
            // success: callback
        // })
    },
    
    ///////////////////////CALLBACK///////////////////////
    //Increments the number of items loaded by one, and 
    updateNumItems(location,result){
        this.numItemsLoaded++;
        //console.log(this.itemsExpected);
        if(this.numItemsLoaded >= this.itemsExpected){
            if(this.returnResults != undefined){
                //console.log("== "+location.zipcode);
                this.returnResults(result,location);
            }
        }
    },
    
    //Takes the data from the 
    processWeather: function(obj,location){
        //var result = this.results[location.zipcode] || new this.result();
        var result = this.results[location.zipcode]
        result.air_temp = obj.main.temp;
        result.wind = obj.wind;
        result.clouds = obj.clouds;
    
        console.log("Weather loaded!");
        
        this.updateNumItems(location,result);
    },
    
     processTides: function(obj,location){
        console.dir(obj);
        //var result = this.results[location.zipcode] || new this.result();
        var result = this.results[location.zipcode];
        result.water_temp 
         
        //console.dir(obj);
    
        console.log("Tides loaded!");
        
        this.updateNumItems(location,result);
    },
    
    dataLoaded: function(obj,location){
        //var result = this.results[location.zipcode] || new this.result();
        var result = this.results[location.zipcode]
        console.log("Data loaded!");
        //console.dir(obj);
        
        this.updateNumItems(location,result);
    }
};

module.exports = app;
