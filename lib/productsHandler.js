/**
 * Created by cxa70 on 11/10/2014.
 */
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/jetbrains');
var Product = mongoose.model('Product', {name: String});

function get(request, response){
    Product.find(function (err, products) {
        response.send(products);
    });
}

function post(request, response){
    var name = request.body.name;
    var product = new Product({name: name});
    product.save(function (err) {
        response.send();
    });
}

exports.get = get;
exports.post = post;