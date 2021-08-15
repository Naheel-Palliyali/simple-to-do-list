// jshint esversion: 6
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
const date = require(__dirname + "/date.js");

 var items = ["eat"];
 var work = [];

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {

    const day = date.getDay();
    res.render("list", {listName: day, listItems: items});
    
});

app.get("/work", function(req, res) {

    res.render("list", {listName: "Work", listItems: work});
    
});

app.post("/", function(req, res){

    var newItem = req.body.item;
    if (req.body.list === "Work"){
        work.push(newItem);
        res.redirect("/work");
    } else {
        items.push(newItem);
        res.redirect("/");
    }
});

app.listen(3000, function(){
    console.log("The server is running on port 3000");
});