'use strict'

var vidoeplay = document.querySelector('video#player');


function gotMediaStream(stream) {
    vidoeplay.srcObject = stream;
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
        .catch(handleGetMediaError);
}

