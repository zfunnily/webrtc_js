'use strict'

var express = require('express');
var serveIndex= require('serve-index');
var http = require('http');
var https = require('https');
var fs = require('fs');

var socketIo = require('socket.io');
var log4js = require('log4js');

var USERVOUNT = 3

log4js.configure({
    appenders: {
        file: {
            type: 'file',
            filename: 'app.log',
            layout: {
                type: 'pattern',
                pattern: '%r %p - %m',
            }
        }
    },
    categories: {
        default: {
            appenders: ['file'],
            level: 'debug'
        }
    }
});
var logger = log4js.getLogger();

var app = express();
app.use('/', express.static('./public'));

var options = {
    key: fs.readFileSync('./cert/privatekey.pem'),
    cert: fs.readFileSync('./cert/certificate.pem')
}

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);
var io = socketIo.listen(httpsServer);

io.sockets.on('connection', (socket) => {
    socket.on('message', (room, data) => {
        socket.to(room).emit('message', room, data);
    })

    socket.on('join',(room)=>{
        socket.join(room);
        var myRoom = io.sockets.adapter.rooms[room];
        var users = (myRoom) ? Object.keys(myRoom.sockets).length : 0;//拿到房间里所有的人数
        logger.debug('the number of user in room is:' + users);

        if (users < USERVOUNT) {
            socket.emit('joined', room, socket.id); //给本人回消息
            if (users > 1) {
                socket.to(room).emit('otherjoin', room, socket.id);
            }
        }else {
            socket.leave(room);
            socket.emit('full', room, socket.id);
        }
        //socket.emit('joined', room, socket.id); //给本人回消息
        //socket.to(room).emit('joined', root, socket.id); //除自己之外
        //socket.broadcast.emit('joined', room, socket.id); //除自己外，全部站点
        //io.in(room).emit('joined', room, socket.id)//房间内所有人
    });
    socket.on('leave',(room)=>{
        var myRoom = io.sockets.adapter.rooms[room];
        var users = (myRoom) ? Object.keys(myRoom.sockets).length : 0;//拿到房间里所有的人数
        logger.debug('the user number of room is:' + (users-1));

        socket.to(room).emit('bye', room, socket.id); //除了自己以外的其他人发送bye
        socket.emit('leaved', room, socket.id);// 给自己发送leaved
        //socket.leave(room);
        //socket.emit('joined', room, socket.id); //给本人回消息
        //socket.to(room).emit('joined', root, socket.id); //除自己之外
        //io.in(room).emit('joined', room, socket.id)//房间内所有人
        //socket.broadcast.emit('leave', room, socket.id); //除自己外，全部站点
    });
});

httpsServer.listen(8888,'0.0.0.0', function() {
        console.log('HTTPS Server is running on: http://0.0.0.0:%s', 8888);
    });
httpServer.listen(8887,'0.0.0.0', function() {
    console.log('HTTP Server is running on: http://0.0.0.0:%s', 8887);
});


//可以根据请求判断是http还是https
app.get('/', function (req, res) {
    if(req.protocol === 'https') {
        res.status(200).send('This is https visit!');
    }
    else {
        res.status(200).send('This is http visit!');
    }
});

