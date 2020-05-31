'use strict'

var vidoeplay = document.querySelector('video#player');
var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var videoSource = document.querySelector('select#videoSource')

function gotDevices(deviceInfos) {
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
    vidoeplay.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}

function handleGetMediaError(err) {
    console.log('getUserMedia error:', err);
}

if (!navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia)
{
    console.log("getUserMedia is not support");
}
else{
    var constraints = {
        video: true,
        audio: false
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(gotMediaStream)
        .then(gotDevices)
        .catch(handleGetMediaError);
}

