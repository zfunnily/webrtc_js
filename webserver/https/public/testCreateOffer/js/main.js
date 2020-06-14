'use strict'
var createOffer = document.querySelector('button#createOffer');

var pc = new RTCPeerConnection();
var pc2 = new RTCPeerConnection();

function getAnswer(desc) {
    console.log("getAnswer:", desc.sdp);
    pc2.setLocalDescription(desc);
    pc.setRemoteDescription(desc);
}

function handleAnswerError(err) {
    console.log('Fail to answer stream:', err);
}

function handleOfferError(err) {
    console.error('Faile to create Offer!', err);
}

function getOffer(desc) {
    console.log("getOffer:",desc.sdp);

    pc.setLocalDescription(desc);
    pc2.setRemoteDescription(desc);

    pc2.createAnswer()
        .then(getAnswer)
        .catch(handleAnswerError);
}

function getMediaStream(stream) {
    stream.getTracks().forEach((track) => {
        pc.addTrack(track);
    });

    var options = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1,
        iceRestart: true
    }

    pc.createOffer(options)
        .then(getOffer)
        .catch(handleOfferError);
}

function handleError(err) {
    console.error("Fail to getMediaStream stream:", err);
}

function getStream() {
    if (!navigator.mediaDevices
        || !navigator.mediaDevices.getUserMedia){
        console.error("getUserMedia is not support !");
        return;
    }
    var constraints = {
        audio: false,
        video: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(getMediaStream)
        .catch(handleError)
}

function test() {
    if (!pc) {
        console.error('pc is null');
    }

    getStream();

    return;
}

createOffer.onclick = test;
