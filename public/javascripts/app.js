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
        $scope.messages = [];

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
                text: $scope.name + ": " + $scope.message
            });

            // clear message box
            $scope.message = '';
        };
    });

    jetbrains.controller('altChatCtrl', function($scope, socket){
        var app = this;
        $scope.messages = [];
        $scope.rooms = [];
        $scope.users = [];
        $scope.ranVal = "";

        socket.on('updateUsers', function(result){
            $scope.updateUsers(result.users);
        });
        socket.on('nameResult', function(result){
            var message;
            if(result.success){
                message = 'You are now known as ' + result.name + '.';
                $scope.name = result.name;
                if(result.users){
                    $scope.updateUsers(result.users);
                }
            }else{
                message = result.message;
            }
            $scope.messages.push(message);
        });

        socket.on('joinResult', function(result){
            $scope.room = result.room;
            $scope.messages.push('Room changed.');
            if(result.users){
                $scope.updateUsers(result.users);
            }
        });

        socket.on('message', function(message){
            $scope.messages.push(message.text);
            if(message.users){
                $scope.updateUsers(message.users);
            }
        });

        socket.on('rooms', function(rooms){
            $scope.rooms = [];
            for (var room in rooms){
                room = room.substring(1, room.length);
                if(room != ''){
                    $scope.rooms.push(room);
                }
            }
        });

        socket.on('random', function(value){
            $scope.ranVal = value.value;
            socket.emit('inbound', { name: $scope.name });
        });

        var chatApp = new Chat(socket);


        setInterval(function(){
            socket.emit('rooms');
        }, 1000);

        socket.emit('inbound', { name: $scope.name });

        $scope.processUserInput = function(){
            var message = $scope.message;
            var room = $scope.room;
            var user = $scope.name;
            var systemMessage;

            if (message.charAt(0)=='/'){
                systemMessage = chatApp.processCommand(message);
                if(systemMessage){
                    $scope.messages.push(systemMessage);
                }
            } else {
                chatApp.sendMessage(room, message);
                $scope.messages.push($scope.name + ": " + message);
            }

            $scope.message = '';
        };

        $scope.changeName = function(){
            var command = '/nick ' + $scope.newName;
            var systemMessage = chatApp.processCommand(command);
            if(systemMessage){
                $scope.messages.push(systemMessage);
            }

            $scope.newName = '';
        };

        $scope.changeRoom = function(newRoom){
            var room = newRoom;
            if(!newRoom){
                room = $scope.newRoom;
            }

            var command = '/join ' + room;
            var systemMessage = chatApp.processCommand(command);
            if(systemMessage){
                $scope.messages.push(systemMessage);
            } else {
                $scope.newRoom = '';
            }
        };

        $scope.updateUsers = function(users){
            for(var i=0;i<users.length;i++){
                if(users[i]===$scope.name){
                    users.splice(i, 1);
                    break;
                }
            }
            $scope.users = users;
        };

    });

})();