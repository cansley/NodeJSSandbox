/**
 * Created by cxa70 on 10/10/2014.
 */
var io;
var guestNumber=1;
var nicknames={};
var namesused=[];
var currentRoom={};
var moment = require('moment');

exports.listen = function(server){
    io = require('socket.io').listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket){
        guestNumber = assignGuestName(socket, guestNumber, nicknames, namesused);
        joinRoom(socket, 'Lobby');

        handleMessageBroadcasting(socket);
        handleNameChangeAttempts(socket, nicknames, namesused);
        handleRoomJoining(socket);

        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        });

        socket.on('inbound', function(user){
            console.log('Got inbound request...' + user.name);
            getPrime(socket);
        });

        handleClientDisconnection(socket, nicknames, namesused);

        //setInterval(function(){
        //    var encoder = require("../BaseEncoder");
        //    var val = Math.floor((Math.random() * 1000)+1).Encode(64);
        //    socket.emit('random', {value: val});
        //}, 1000);
    });


};

function isPrime(n) {

    // If n is less than 2 or not an integer then by definition cannot be prime.
    if (n < 2) {return false}
    if (n != Math.round(n)) {return false}

    // Now assume that n is prime, we will try to prove that it is not.
    var isPrime = true;

    // Now check every whole number from 2 to the square root of n. If any of these divides n exactly, n cannot be prime.
    for (var i = 2; i <= Math.sqrt(n); i++) {
        if (n % i == 0) {isPrime = false}
    }

    // Finally return whether n is prime or not.
    return isPrime;

}

function getPrime(socket){
    var val = Math.floor((Math.random() * 10000)+1);
    var runCount = 1;
    while(!isPrime(val)){
        val = Math.floor((Math.random() * 10000)+1);
        runCount += 1;
    }
    setTimeout(function(){
        console.log(runCount + ' tries to get prime.');
        socket.emit('random', { value: 'Got Prime at ' + moment().format('MM-DD-YYYY hh:mm:ss A')});}, 10000);

}

function assignGuestName(socket, guestNumber, nickNames, namesUsed){
    var name = 'Guest'+ guestNumber;
    nickNames[socket.id] = name;

    namesUsed.push(name);
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    return guestNumber+1;
}

function getRoomMembers(socket, room){
    var usersInRoom = io.sockets.clients(room);
    var users = [];
    if(usersInRoom.length > 0){
        for (var index in usersInRoom){
            var userSocketId = usersInRoom[index].id;
            users.push(nicknames[userSocketId]);
        }
    }

    return users;
}

function leaveRoom(socket, room){
    var leavingUser = nicknames[socket.id];
    var users = getRoomMembers(socket, room);
    socket.broadcast.to(room).emit('message', {text: leavingUser + ' has left the room.'});
    socket.broadcast.to(room).emit('updateUsers', {users: users});
}

function joinRoom(socket, room){
    socket.join(room);
    currentRoom[socket.id] = room;

    var users = getRoomMembers(socket, room);
    if(users.length > 0){
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in users){
            if(index>0){
                usersInRoomSummary += ", ";
            }
            usersInRoomSummary += users[index];
        }
        usersInRoomSummary += '.';

        socket.emit('joinResult', {room: room, users: users});
        socket.broadcast.to(room).emit('message', {text: nicknames[socket.id] + ' has joined ' + room + '.'});
        socket.broadcast.to(room).emit('updateUsers', {users: users});
        socket.emit('message', {text: usersInRoomSummary});
    }
}

function handleNameChangeAttempts(socket, nickNames, namesUsed){
    socket.on('nameAttempt', function(name){
        if(name.indexOf('Guest')== 0){
            socket.emit('nameResult', {
               success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed.indexOf(name) == -1){
                var previousName = nickNames[socket.id];
                var previousNameIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                nickNames[socket.id] = name;
                delete namesUsed[previousNameIndex];
                var users = getRoomMembers(socket, currentRoom[socket.id]);
                socket.emit('nameResult', {success: true, name: name, users: users });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.', users: users
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('updateUsers', { users: users})
            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: 'That name is already in use.'
                });
            }
        }
    });
}

function handleMessageBroadcasting(socket){
    socket.on('message', function(message){
       socket.broadcast.to(message.room).emit('message', {
           text: nicknames[socket.id] + ": " + message.text
       });
    });
}

function handleRoomJoining(socket){
    socket.on('join', function(room){
        var oldRoom = currentRoom[socket.id];
        socket.leave(oldRoom);
        leaveRoom(socket, oldRoom);
        joinRoom(socket, room.newRoom);
    });
}

function handleClientDisconnection(socket){
    socket.on('disconnect', function(){
        var nameIndex = namesused.indexOf(nicknames[socket.id]);
        delete namesused[nameIndex];
        delete nicknames[socket.id];
    });
}