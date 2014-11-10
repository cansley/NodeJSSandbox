/**
 * Created by cxa70 on 10/9/2014.
 */
var express = require("express");
var app = express();

var cors = require("cors");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = require("./routes");
app.use(router);

var http = require("http");
var server = http.Server(app);

var chatServer = require("./lib/chat_server");
chatServer.listen(server);

server.listen(3000, function () {
    console.log("Server listening on port 3000.");
});