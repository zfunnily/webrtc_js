'use strict'

var express = require('express');
var serveIndex= require('serve-index');
var http = require('http');
var https = require('https');
var fs = require('fs');

var socketIo = require('socket.io');
var log4js = require('log4js');

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

var httpServer = http.createServer(app).listen(8887, function() {
        console.log('HTTP Server is running on: http://localhost:%s', 8887);
    });

var httpsServer = https.createServer(options, app);
var io = socketIo.listen(httpsServer);

io.sockets.on('connection', (socket) => {
    socket.on('join',(room)=>{
        socket.join(room);
        var myRoom = io.sockets.adapter.rooms[room];
        var users = Object.keys(myRoom.sockets).length;//拿到房间里所有的人数
        logger.log('the number of user in room is:' + users);

        //socket.emit('joined', room, socket.id); //给本人回消息
        //socket.to(room).emit('joined', root, socket.id); //除自己之外
        //io.in(room).emit('joined', room, socket.id)//房间内所有人
        socket.broadcast.emit('joined', room, socket.id); //除自己外，全部站点
    });
    socket.on('leave',(room)=>{
        var myRoom = io.sockets.adapter.rooms[room];
        var users = Object.keys(myRoom.sockets).length;//拿到房间里所有的人数
        //users - 1;

        socket.leave(room);
        //socket.emit('joined', room, socket.id); //给本人回消息
        //socket.to(room).emit('joined', root, socket.id); //除自己之外
        //io.in(room).emit('joined', room, socket.id)//房间内所有人
        socket.broadcast.emit('leave', room, socket.id); //除自己外，全部站点
    });
});

httpsServer.listen(8888,'0.0.0.0', function() {
        console.log('HTTPS Server is running on: http://0.0.0.0:%s', 8888);
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

