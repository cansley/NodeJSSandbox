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

    };


    loadProducts();
});

jetbrains.controller("TodoCtrl", function($scope, $http){
    var app = this;
    var url = "http://localhost:3000/todo";


    function loadTodos(){
        $http.get(url).then(function(todos){
            app.todos = todos.data.items;
            app.newTodo = "";
        }, function(err){
            console.log(err.message);
        });
    }

    app.saveTodo = function(newTodo){
        $http.post(url, {newItem: newTodo})
            .success(function() {
                loadTodos();
            });
    };

    app.removeTodo = function(todo){
        $http.delete(url+"/"+todo.idx)
            .success(function(){
                loadTodos();
            });
    };

    loadTodos();
});