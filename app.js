require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require('md5');

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

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function(err) {
        if (!err) {
            console.log("Successful");
            res.render("secrets");
        } else {
            console.log(err);
        }
    });

});

app.post("/login", function(req, res) {

    const email = req.body.username;
    const password = md5(req.body.password);

    User.findOne({ email: email }, function(err, foundUser) {
        if (foundUser) {
            if (password === foundUser.password) {
                console.log("Password Matched");
                res.render("secrets");
            } else {
                console.log("Invalid Password");
            }

        } else {
            console.log("User not found");
        }
    });
});



app.listen(3000, function() {
    console.log("Server started successfully");
});
