/**
 * Created by cxa70 on 10/21/2014.
 */
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var items = [];
var url = require("url");

function post(request, response){
    var item = '';
    request.setEncoding('utf8');
    if(request.body){ //for express, request should be JSON compliant otherwise weird shit happens...
        if(request.body.newItem){
            items.push(request.body.newItem);
            response.end("OK\n");
        } else {
            response.statusCode = 400;
            response.end("Invalid item submitted.");
        }
    } else { // for non-express, request may or may not be JSON compliant.
        request.on('data', function (chunk) {
            console.log('chunking...');
            item += chunk;
        });

        request.on('end', function () {
            items.push(item);
            response.end('OK\n');
        });
    }
}

function get(request, response){
    var body = items.map(function (item, i) {
        return i + ') ' + item;
    }).join('\n');

    response.setHeader('Content-Length', Buffer.byteLength(body));
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.end(body);
}

function del(request, response){
    var pathName = url.parse(request.url).pathname;
    var idx = parseInt(pathName.slice(pathName.lastIndexOf('/')+1), 10);

    if(isNaN(idx)){
        response.statusCode = 400;
        response.end("Invalid item id'");
    } else if(!items[idx]){
        response.statusCode = 404;
        response.end("Item not found.");
    } else {
        items.splice(idx, 1);
        response.end("OK\n");
    }
}

function put(request, response){
    var text = '';
    request.setEncoding('utf8');

    if (request.body){
        if(typeof request.body.idx !== undefined){
            if (isNaN(request.body.idx)) {
                response.statusCode = 400;
                response.end("Invalid item submitted.");
                return;
            }

            if (!items[request.body.idx]) {
                response.statusCode = 400;
                response.end("Item not found.");
            }
            items[request.body.idx] = request.body.content;
            response.end('OK\n');
        } else {
            response.statusCode = 400;
            response.end("Invalid item submitted.");
        }
    } else {
        request.on('data', function (chunk) {
            console.log('chunking...');
            text += chunk;
        });

        request.on('end', function () {
            var item;
            try {
                item = JSON.parse(text);
                if (isNaN(item.idx)) {
                    response.statusCode = 400;
                    response.end("Invalid item submitted.");
                    return;
                }

                if (!items[item.idx]) {
                    response.statusCode = 400;
                    response.end("Item not found.");
                }
                items[item.idx] = item.content;
                response.end('OK\n');
            } catch (err) {
                response.statusCode = 400;
                response.end("Invalid item submitted.");
            }
        });
    }
}

exports.post = post;
exports.get = get;
exports.delete = del;
exports.put = put;