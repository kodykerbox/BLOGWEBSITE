const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Kody's first website that he built from scratch. Learned a lot and had fun with it";

const aboutContent = "My name is Kody Kerbox, I live in Haiku, Maui and attend UHMC"

const contactContent = "You can shoot me a message on my school email";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

let posts = [];

app.get("/", function (req, res){
  res.render("home", {startingContent: homeStartingContent,posts: posts
  });
});

app.get("/about", function (req, res){
  res.render("about", {aboutContent: aboutContent});
  });

app.get("/contact", function (req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function (req, res){
  res.render("compose");
});

app.post("/compose", function (req, res){
  const post = {
title: req.body.postTitle,
content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });
});


const weatherCity = ["city"];

// need to write out an app.get function that open a route /weather Need an EJS view called weather.ejs that displays one text field to input city name
app.get("/weather", function (req, res){
  res.render("weather", {weatherCity: weatherCity,});
  });

//This EJS view will input a city name from user

let cityName = ["cityInput"];

// Then need to write out an app.get function that will use the city name to query the Weather API to retrieve basic weather information - temperature, description and humidity

// The display of the weather information must be saved to an array and then the results of the array must be pushed to the /weather EJS view to display

//invoked after hitting go in the html form
app.post("/weather", function(req, res) {

        var cityname = String(req.body.cityInput);
    
        const units = "imperial";
        const apiKey = "c15c1d22c96a3c5d88424b3eb94a86af";
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=" + units + "&APPID=" + apiKey;
    
    https.get(url, function(response){
        
        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const city = weatherData.name;
            const humidity = weatherData.main.humidity;
            const weatherDescription = weatherData.weather[0].description; 
          
            res.write("<h1> The current weather in " + city + " is " + weatherDescription + "<h1>");

            res.write("<h2>The temperature is " + temp + " Degrees Fahrenheit and the humidity is " + humidity + "% <h2>");

            res.send();
        });
    });
})

// The /weather route and page created by weather.ejs page should allow for the input of the city name, and the display of the weather for the city - temperature in F, description and humidity

app.listen(3000, function() {
  console.log("Server started on port 3000");
});