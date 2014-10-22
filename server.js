/**
 * Created by cxa70 on 10/9/2014.
 */
var express = require("express");
var app  = express();

var cors = require("cors");
var bodyParser=require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/jetbrains');
var Product = mongoose.model('Product', {name: String});

var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var restHandler = require("./restHandler");
var cache = {};
var server = http.Server(app);

function send404(res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found.');
    res.end();
}

function sendFile(res, fpath, contents){
    res.writeHead(200, {"content-type": mime.lookup(path.basename(fpath))});
    res.end(contents);
}


function serverStatic(res, cache, absPath){
        if(cache[absPath]){
        sendFile(res, absPath, cache[absPath]);
    }else{
        fs.exists(absPath, function (exists) {
           if(exists){
               fs.readFile(absPath, function(err, data){
                   if(err){
                       send404(res);
                   }else{
                       cache[absPath] = data;
                       sendFile(res, absPath, data);
                   }
               });
           }else{
               send404(res);
           }
        });
    }
}

function serveFile(req, res){
    var filePath = false;
    if (req.url == "/"){
        filePath = 'public/index.html';
    }else{
        filePath = 'public' + req.url;
    }

    var absPath = './' + filePath;
    serverStatic(res, cache, absPath);
}

/* routes */
app.get("/products", function(req, res){
   Product.find(function(err, products){
       res.send(products);
   });
});

app.post("/products/add", function (req, res) {
    var name = req.body.name;
    var product = new Product({name: name});
    product.save(function(err){
        res.send();
    });
});

app.get("/todo", restHandler.get);
app.post("/todo", restHandler.post);
app.put("/todo", restHandler.put);
app.delete("/todo", restHandler.delete);

app.get("/*", serveFile);
app.get("/", serveFile);
/* end routes */

var chatServer = require("./lib/chat_server");
chatServer.listen(server);

server.listen(3000, function () {
    console.log("Server listening on port 3000.");
});



