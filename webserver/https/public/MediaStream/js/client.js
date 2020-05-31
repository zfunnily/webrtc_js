'use strict'

var vidoeplay = document.querySelector('video#player');
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var videoSource = document.querySelector('select#videoSource')
var audioplayer = document.querySelector('audio#audioplayer');

//filter
var filtersSelect = document.querySelector('select#filter');

//picture
var snapshot = document.querySelector('button#snapshot');
var picture = document.querySelector('canvas#picture');
picture.width = 320;
picture.height = 240;

function gotDevices(deviceInfos) {

    videoSource.options.length = 0;
    deviceInfos.forEach(function (deviceInfo) {
        var options = document.createElement('option');
        options.text = deviceInfo.label;
        options.value = deviceInfo.deviceId;

        if(deviceInfo.kind === 'audioinput'){
            audioSource.appendChild(options);
        }else if (deviceInfo.kind === 'audiooutput') {
            audioOutput.appendChild(options);
        }else if (deviceInfo.kind === 'videoinput') {
            videoSource.appendChild(options);
        }
    })
}

function gotMediaStream(stream) {
    //vidoeplay.srcObject = stream;
    audioplayer.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}

function handleGetMediaError(err) {
    console.log('getUserMedia error:', err);
}

function start() {
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia)
    {
        console.log("getUserMedia is not support");
    }
    else{
        var deviceId = videoSource.value;
        /*var constraints = {
            video: {
                width: 640,
                height: 480,
                frameRate: 30,
                facingMode: 'user',
                deviceId: deviceId ? deviceId : undefined
            },
            audio: {
                noiseSuppression: true,
                echoCancellation: false,
            },
        };*/
        var constraints = {
            video: false,
            audio: true
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMediaStream)
            .then(gotDevices)
            .catch(handleGetMediaError);
    }
}

start();

videoSource.onchange = start;

filtersSelect.onchange = function () {
    vidoeplay.className = filtersSelect.value;
}

snapshot.onclick = function () {
    //------拍下来的图片和视频一样加上了特效
    picture.className = filtersSelect.value;
    picture.getContext('2d').drawImage(vidoeplay,
                                        0,0,
                                        picture.width,
                                        picture.height)
}
