'use strict'

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnConn = document.querySelector('button#connserver');
var btnLeave = document.querySelector('button#leave');

var localStream = null;

var roomid;
var socket = null;
var state = 'init';

var ROOM_ID = '111111';

function conn() {
    socket = io.connect();
    socket.on('joined', (roomid, id) => {
        console.log('reveive join message:', roomid, id);
        btnConn.disabled = true;
        btnLeave.disabled = false;

    });
    socket.on('otherjoin', (roomid, id) => {
        console.log('reveive otherjoin message:', roomid, id);

    });
    socket.on('full', (roomid, id) => {
        console.log('reveive full message:', roomid, id);

    });
    socket.on('leaved', (roomid, id) => {
        console.log('reveive leaved message:', roomid, id);

    });
    socket.on('bye', (roomid, id) => {
        console.log('reveive bye message:', roomid, id);
    });

    socket.on('message', (roomid, data)=> {
        console.log('reveive client message:', roomid, data);
    });

    socket.emit('join', ROOM_ID);
    return;
}

function getMediaStream(stream) {
    localVideo.srcObject = stream
    localStream = stream

    conn();
}

function handleError(err) {
    console.error('Faile to getMedia Stream!', err);
}

function handleAnswerError(err) {
    console.error('Faile to create Answer!', err);

}

function handleOfferError(err) {
    console.error('Faile to create Offer!', err);
}

function connSignalServer() {
    start();
    return true;
}

function start() {
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
        console.error('the getUserMedia is not supported!');
        return;
    }else{
        var constraints = {
            video: {
                width:300,
                height:300
            },
            audio: false
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(getMediaStream)
            .catch(handleError)
    }
}


function closeLocalMedia() {
    if (localStream && localStream.getTracks()) {
        localStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    localStream = null;
}

function leave() {
    if (socket) {
        socket.emit('leave', ROOM_ID);
    }

    btnConn.disabled = false;
    btnLeave.disabled = true;
}

btnConn.onclick = connSignalServer;
btnLeave.onclick = leave;
