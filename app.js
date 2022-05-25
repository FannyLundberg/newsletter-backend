var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();
const cors = require("cors");

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect("mongodb://localhost:27017", {
    useUnifiedTopology: true
})
.then(client => {
    console.log("Uppkopplad mot databasen")

    const db = client.db("newsletter");

    app.locals.db = db;
})

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


// app.get("/set", (req, res) => {

//     res.cookie("admin", true);

//     res.send("Kaka sparad")
// });


// app.get("/cookies", (req, res) => {

//     res.send("Här är din kaka. admin: " + req.cookies["admin"]);
// });

module.exports = app;
