/**
 * Created by cxa70 on 11/10/2014.
 */
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var items = [];
var url = require("url");
var sprintf = require("sprintf").sprintf;

function post(request, response){
    setTimeout(function(){
    var type = request.headers['content-type'] || '';
    if(type.indexOf('multipart/form-data') !== 0){
        response.statusCode = 400;
        response.end("Bad request: expecting multipart/form-data");
    }

    var files = [];
    var form = formidable.IncomingForm();
    form.on('field', function(field, value){
        console.log(sprintf("Field: %1$s, Value: %2$s", field, value));
    });
    form.on('file', function(name, file){
        console.log(sprintf("Name: %1$s, File: %2$s", name, file));
        files.push({name: file.name});
    });
    form.on('end', function(){
        response.send({Success: "true", Message: "Uploaded files.", files: files});
    });
    form.parse(request);
    }, 5000);
}

function get(request, response){
    response.statusCode = 200;
    response.send("OK\n");
}

function del(request, response){}

function put(request, response){}

exports.post = post;
exports.get = get;
//exports.delete = del;
//exports.put = put;