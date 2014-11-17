/**
 * Created by cxa70 on 11/10/2014.
 */
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var cache = {};

function send404(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: Resource not found.');
    res.end();
}

function sendFile(res, fpath, contents) {
    res.writeHead(200, {"content-type": mime.lookup(path.basename(fpath))});
    res.end(contents);
}

function serverStatic(res, cache, absPath) {
    cache = [];
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        var root = path.resolve(__dirname + "/../");
        var resPath = path.resolve(absPath);
        if (resPath.substr(0, root.length) !== root){
            send404(res);
        } else {
            fs.exists(absPath, function (exists) {
                if (exists) {
                    fs.readFile(absPath, function (err, data) {
                        if (err) {
                            send404(res);
                        } else {
                            cache[absPath] = data;
                            sendFile(res, absPath, data);
                        }
                    });
                } else {
                    send404(res);
                }
            });
        }
    }
}

function serveFile(req, res) {
    var filePath = false;
    if (req.url == "/") {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }

    var absPath = './' + filePath;
    serverStatic(res, cache, absPath);
}


exports.serveFile = serveFile;