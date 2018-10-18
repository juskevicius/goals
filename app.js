const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var express = require("express");
var app = express();
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/webpage_template'));

var port = 27017;

// Connection URL
const url = 'mongodb://localhost:27017/goals';
 

// Database Name
const dbName = 'Goals';
 
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  if (err) throw err;
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
   
  app.get("/", (req, res) => {
    res.sendFile(__dirname + '/webpage_template/index.html')
  });

  app.get("/add", (req, res) => {
    res.sendFile(__dirname + '/webpage_template/add.html')
  });

  app.post("/addAGoal", (req, res) => {
    db.collection("goalList").insertOne(req.body, (err, result) => {
      if (err) throw err;
      console.log("saved to DB");
      /*res.redirect('/add');*/
      db.collection("goalList").find().toArray(function(err, documents) {
        if (err) throw err;
        console.log(documents);
      });
    });
  });

  app.get("/displayAll", (req, res) => {
    
    db.collection("goalList").find().toArray(function(err, documents) {
      if (err) throw err;
      res.send(documents);
    });
  });

   
  app.listen(port, () => {
   console.log("Server listening on port " + port);
  });

  /*
  db.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("Collection created!");

    db.listCollections().toArray(function(err, collections){
      console.log(collections);
      client.close();
    });

  });*/

});
  