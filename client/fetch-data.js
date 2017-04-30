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
        city: "Rochester",
        state: "NY",
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
        })
        /*tidesAndCurrents: Object.seal({
            dataType: "jsonp",
            url: "https://tidesandcurrents.noaa.gov/api/datagetter?date=today&station=",
            format: "[url] [station] &product=water_level&datum=STND&units=metric&time_zone=gmt&application=web_services&format=xml",
            callback: undefined
        })*/
    }),
    
    result: Object.seal({
        air_temp: undefined,
        wind: undefined,
        clouds: undefined,
        clear: function(){
            this.air_temp = undefined;
            this.wind = undefined;
            this.clouds = undefined;
        }
    }),
    numItemsLoaded: 0,
    itemsExpected: 1,
    
    //Function pointer for when the program is done loading
    returnResults: undefined,
    
    ///////////////////////METHODS///////////////////////
    //Completes any initialization for the project
    setup: function(index){
        this.index = index;
        console.log(this.index);
        this.location = Object.seal(app.locations[index])
        this.sites.weather.callback = this.processWeather.bind(this);
        //this.sites.tidesAndCurrents.callback = this.processTides.bind(this);
    },
    
    //Fetches the data for the project
    fetch: function(){
        //console.dir(this);
        this.reset();
        
        this.retrieveData(this.sites.weather,this.location);
        //this.retrieveData(this.sites.tidesAndCurrents);
    },
    
    //Clears result and numItemsLoaded
    reset: function(){
        this.result.clear();
        this.numItemsLoaded = 0;
    },
    
    ///////////////////////API FETCHES///////////////////////
    //Retrieves data from a given site
    retrieveData: function(site,location){
        console.dir(site);
        
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
        console.log(url);
        request(url, function(err,res, body) {
            console.log(err);
            console.log(body);
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
    updateNumItems(location){
        this.numItemsLoaded++;
        console.log(this.itemsExpected);
        if(this.numItemsLoaded >= this.itemsExpected){
            if(this.returnResults != undefined){
                console.log("== "+location.zipcode);
                this.returnResults(this.result,location);
            }
        }
    },
    
    //Takes the data from the 
    processWeather: function(obj,location){
        this.result.air_temp = obj.main.temp;
        this.result.wind = obj.wind;
        this.result.clouds = obj.clouds;
    
        console.log("Weather loaded!");
        
        this.updateNumItems(location);
    },
    
     processTides: function(obj,location){
        console.dir(obj);
    
        console.log("Tides loaded!");
        
        this.updateNumItems(location);
    },
    
    dataLoaded: function(obj,location){
        console.log("Data loaded!");
        console.dir(obj);
        
        this.updateNumItems(location);
    }
};

module.exports = app;
