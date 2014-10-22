/**
 * Created by q183257 on 9/25/13.
 */
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var postData = "";
        var pathName = url.parse(request.url).pathname;
        var action = request.method;
        //console.log("Request for " + pathName + " received.");

        route(handle, action, request, response, postData);
    }

    http.createServer(onRequest).listen(8888);

    console.log("Server started...");
}

exports.start = start;