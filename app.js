// jshint esversion: 6
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

// itemsSchema
const itemsSchema = {
    name: {
        type: String,
        required: true
    }
};

const Item = mongoose.model("Item", itemsSchema );


const item1 = new Item ({
    name: "buy Stationery"
});

const item2 = new Item ({
    name: "Click here to add a new item"
});

const item3 = new Item ({
    name: "Click here to delete a new item"
});

const defaultItems = [item1, item2, item3];

// new list Schema
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("list", listSchema);


// Home route
app.get("/", function(req, res) {
    const day = date.getDay();

    Item.find({}, function(err, results) {
        if (results.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully updated database");
                }
            });
            res.redirect("/");

        } else {
            res.render("list", {listName: day, listItems: results});
        }
    });
});

// Custom list using route name
app.get("/lists/:listTitle", function(req, res) {

    const listTitle = _.capitalize(req.params.listTitle); 
    
    List.findOne({name: listTitle}, function(err, results){
        if (!err) {
            if (!results){
                // create new list
                console.log("List does not exist");
                const list = new List ({
                    name: listTitle,
                    items: defaultItems
                });
 
                list.save(function(err){
                    if(!err){
                        console.log("List updated successfully");
                        res.redirect("/lists/" + listTitle);
                    }
                });
            }
            
            else {
                // show existing list
                console.log("list already exists");
                res.render("list", {listName: listTitle, listItems: results.items});
            }
        }
    });
});



// create a new list item
app.post("/", function(req, res){

    var newItem = req.body.item;
    var listName = req.body.list;
    
    const item = new Item ({
        name: newItem
    });
    
    if (listName === date.getDay()){
    
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
           if(!err) {
               foundList.items.push(item);
               foundList.save();
               res.redirect("/lists/" + listName);
           }
        });
    }
});

// delete a new list item
app.post("/delete", function(req, res) {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(listName, itemId);
    
    if (listName === date.getDay()){
        console.log("checked");
        Item.findByIdAndRemove(itemId, function(err){
            if(!err){
                console.log("item removed");
                res.redirect("/");
            }
        });
    } 
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, {useFindAndModify: false}, function(err, foundList) {
            if (!err){
                console.log("List updated");
                res.redirect("/lists/" + listName);
            }
        });
    }
});

app.listen(3000, function(){
    console.log("The server is running on port 3000");
});