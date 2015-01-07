(function() {
  var app, bodyParser, chatServer, cors, express, http, https, router, server, ssl_key, ssl_server, timeTracker;

  express = require('express');

  app = express();

  cors = require('cors');

  bodyParser = require('body-parser');

  app.use(cors());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  router = require('./routes');

  app.use(router);

  http = require('http');

  https = require('https');

  ssl_key = require('./lib/sslKeyReader');

  server = http.Server(app);

  ssl_server = https.createServer(ssl_key.options, app);

  chatServer = require('./lib/chat_server');

  chatServer.listen(server);

  timeTracker = require('./lib/timetracker_mssql.js');

  timeTracker.GetWorkItems();

  server.listen(3000);

  console.log('Server listening on port 3000');

  ssl_server.listen(3001);

  console.log('SSL Server listening on port 3001');

}).call(this);
