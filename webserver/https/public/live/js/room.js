'use strict'

var JOINED_CONN = 'joined_conn';
var JOINED_UNBIND = 'joined_unbind';
var FULL = 'FULL';
var LEAVED = 'leaved';

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');

var btnConn = document.querySelector('button#connserver');
var btnLeave = document.querySelector('button#leave');

var localStream = null;

var socket = null;
var state = 'init';

var roomid = '111111';

function handleAnswerError(err) {
    console.error('Faile to create Answer!', err);
}

function getAnswer(desc) {
    console.log('answer sdp:', desc);
    sendMessage(roomid, desc);
}

function conn() {
    socket = io.connect();
    socket.on('joined', (roomid, id) => {
        console.log('reveive join message:', roomid, id);

        createPeerConnection();
        btnConn.disabled = true;
        btnLeave.disabled = false;

    });
    socket.on('otherjoin', (roomid, id) => {
        console.log('reveive otherjoin message:', roomid, id, state);

        if (state === JOINED_UNBIND) {
            createPeerConnection();
        }
        state = JOINED_CONN;
        // 媒体协商
        console.log('receive otherjoin message:state', state);
        call();

    });
    socket.on('full', (roomid, id) => {
        console.log('reveive full message:', roomid, id);
        state = LEAVED;
        console.log('receive full message:state:', state);
        socket.disconnect();
        alert('the room is full!');

    });
    socket.on('leaved', (roomid, id) => {
        console.log('reveive leaved message:', roomid, id);
        state = LEAVED;
        console.log('receive leaved message state=', state);
        socket.disconnect();

        btnConn.disabled = false;
        btnLeave.disabled = true;

    });
    socket.on('bye', (roomid, id) => {
        console.log('reveive bye message:', roomid, id);
        state = JOINED_UNBIND;
        closePeerConnection();
        console.log('receive bye message state=', state);
    });

    socket.on('message', (roomid, data)=> {
        console.log('reveive client message:', roomid, data);

        //媒体协商
        if (data) {
            if (data.type === 'offer') {
                pc.setRemoteDescription(new RTCSessionDescription(data));
                pc.createAnswer()
                    .then(getAnswer)
                    .catch(handleAnswerError);

            }else if (data.type === 'answer') {
                pc.setRemoteDescription(new RTCSessionDescription(data));
            }else if (data.type === 'candidate') {
                var candidate = new RTCIceCandidate({
                    sdpMLineIndex: data.label,
                    candidate: data.candidate
                });
                pc.addIceCandidate(data.candidate);

            } else {
                console.error('the message is invalid!', data);
            }
        }
    });

    socket.emit('join', roomid);
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
        socket.emit('leave', roomid);
    }

    //释放资源
    closePeerConnection();
    closeLocalMedia();

    btnConn.disabled = false;
    btnLeave.disabled = true;
}

btnConn.onclick = connSignalServer;
btnLeave.onclick = leave;
