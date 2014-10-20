/**
 * Created by cxa70 on 10/9/2014.
 */
var jetbrains = angular.module("jetbrains", []);

jetbrains.controller("AppCtrl", function($http){
    var app = this;
    var url = "http://localhost:3000/products";

    function loadProducts() {
        $http.get(url).then(function (products) {
            app.products = products.data;
        }, function(err){
            console.log(err.message);
        });
    }

    app.saveProduct = function(newProduct){
        $http.post(url+"/add", {name:newProduct}).success(function () {
            loadProducts();
        })

    }


    loadProducts();
});