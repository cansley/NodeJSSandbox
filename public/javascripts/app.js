/**
 * Created by cxa70 on 10/9/2014.
 */
(function() {
    'use strict';
    var jetbrains = angular.module("jetbrains",[]);

    jetbrains.controller("AppCtrl", function ($http) {
        var app = this;
        var url = "http://localhost:3000/products";

        function loadProducts() {
            $http.get(url).then(function (products) {
                app.products = products.data;
            }, function (err) {
                console.log(err.message);
            });
        }

        app.saveProduct = function (newProduct) {
            $http.post(url + "/add", {name: newProduct}).success(function () {
                loadProducts();
            })

        };


        loadProducts();
    });

    jetbrains.controller("TodoCtrl", function ($scope, $http) {
        var app = this;
        var url = "http://localhost:3000/todo";


        function loadTodos() {
            $http.get(url).then(function (todos) {
                app.todos = todos.data.items;
                app.newTodo = "";
            }, function (err) {
                console.log(err.message);
            });
        }

        app.saveTodo = function (newTodo) {
            $http.post(url, {newItem: newTodo})
                .success(function () {
                    loadTodos();
                });
        };

        app.removeTodo = function (todo) {
            $http.delete(url + "/" + todo.idx)
                .success(function () {
                    loadTodos();
                });
        };

        loadTodos();
    });


    jetbrains.factory('socket', function($rootScope){
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });

    //for reference => http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
    jetbrains.controller('chatCtrl', function($scope, socket){
        var app = this;

        // Socket listeners
        // ================

        socket.on('init', function (data) {
            $scope.name = data.name;
            $scope.users = data.users;
        });

        socket.on('send:message', function (message) {
            $scope.messages.push(message);
        });

        socket.on('change:name', function (data) {
            changeName(data.oldName, data.newName);
        });

        socket.on('user:join', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has joined.'
            });
            $scope.users.push(data.name);
        });

        // add a message to the conversation when a user disconnects or leaves the room
        socket.on('user:left', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has left.'
            });
            var i, user;
            for (i = 0; i < $scope.users.length; i++) {
                user = $scope.users[i];
                if (user === data.name) {
                    $scope.users.splice(i, 1);
                    break;
                }
            }
        });

        // Private helpers
        // ===============

        var changeName = function (oldName, newName) {
            // rename user in list of users
            var i;
            for (i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i] === oldName) {
                    $scope.users[i] = newName;
                }
            }

            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + oldName + ' is now known as ' + newName + '.'
            });
        }

        // Methods published to the scope
        // ==============================

        $scope.changeName = function () {
            socket.emit('change:name', {
                name: $scope.newName
            }, function (result) {
                if (!result) {
                    alert('There was an error changing your name');
                } else {

                    changeName($scope.name, $scope.newName);

                    $scope.name = $scope.newName;
                    $scope.newName = '';
                }
            });
        };

        $scope.sendMessage = function () {
            socket.emit('send:message', {
                message: $scope.message
            });

            // add the message to our model locally
            $scope.messages.push({
                user: $scope.name,
                text: $scope.message
            });

            // clear message box
            $scope.message = '';
        };
    });
})();