require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
// const saltRounds = 10;
const salt = bcrypt.genSaltSync(10);

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", () => {
    console.log("Db is connected");
}, e => console.error(e));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {

    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
        email: req.body.username,
        password: hash
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});

app.post("/login", function (req, res) {

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username }, function (err, foundUser) {
      if (err) {
          console.log(err);
      } else {
          if (foundUser) {
              if (bcrypt.compareSync(password, foundUser.password)) {
                  console.log(foundUser.password);
                  console.log(password);
                  res.render("secrets");
              }
          }
      }
  });
});


app.listen(3000, function() {
    console.log("Server started successfully");
});
