var express = require('express');
var router = express.Router();

var productServer = require("../lib/productsHandler");
router.get("/products", productServer.get);
router.post("/products/add", productServer.post);

var todoHandler = require("../lib/todoRest");
router.get("/todo", todoHandler.get);
router.post("/todo", todoHandler.post);
router.put("/todo", todoHandler.put);
router.delete("/todo/*", todoHandler.delete);

var statServer = require("../lib/staticFileServer");
router.get("/*", statServer.serveFile);
router.get("/", statServer.serveFile);

module.exports = router;
