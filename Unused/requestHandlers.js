/**
 * Created by q183257 on 9/25/13.
 */
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(response)
{
    console.log("Request handler 'start' was called.");

    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; '+
        'charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="upload">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';

    response.writeHead(200, {"Content-Type":"text/html"});
    response.write(body);
    response.end();
}

function upload(response, request)
{
    var form = new formidable.IncomingForm();
    console.log("Request handler 'upload' was called.");
    form.parse(request, function(error, fields, files){
        /* Possible error on Windows systems:
         tried to rename to an already existing file */
        fs.rename(files.upload.path, "/temp/capture.jpg", function(error) {
            if (error) {
                fs.unlink("/temp/capture.jpg");
                fs.rename(files.upload.path, "/temp/capture.jpg");
            }});
        response.writeHead(200, {"Content-Type":"text/html"});

        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });

}

function show(response)
{
    console.log("Request handler 'show' was called.");
    response.writeHead(200, {"Content-Type": "image/png"});
    fs.createReadStream("/temp/capture.jpg").pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;