/**
 * Created by cxa70 on 10/10/2014.
 */
var io;
var guestNumber=1;
var nicknames={};
var namesused=[];
var currentRoom={};

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

        handleClientDisconnection(socket, nicknames, namesused);
    });
};


function assignGuestName(socket, guestNumber, nickNames, namesUsed){
    var name = 'Guest'+ guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });
    namesUsed.push(name);
    return guestNumber+1;
}

function joinRoom(socket, room){
    socket.join(room);
    currentRoom[socket.id] = room;
    socket.emit('joinResult', {room: room});
    socket.broadcast.to(room).emit('message', {text: nicknames[socket.id] + ' has joined ' + room + '.'})

    var usersInRoom = io.sockets.clients(room);
    if(usersInRoom.length > 1){
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for (var index in usersInRoom){
            var userSocketId = usersInRoom[index].id;
            if(userSocketId != socket.id){
                if(index>0){
                    usersInRoomSummary += ", ";
                }
                usersInRoomSummary += nicknames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
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
                socket.emit('nameResult', {success: true, name: name});
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
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
        socket.leave(currentRoom[socket.id]);
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