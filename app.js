// jshint esversion: 6
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 var items = ["eat"];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

const options = {weekday: "long", day: "numeric", month: "long", year: "numeric"};

var day = new Date();
var currentDay = day.toLocaleDateString("en-US", options);

app.get("/", function(req, res) {

    res.render("list", {listDay: currentDay, listItems: items});

});

app.post("/", function(req, res){

    var newItem = req.body.item;
    items.push(newItem);

    res.redirect("/");
});

app.listen(3000, function(){
    console.log("The server is running on port 3000");
});