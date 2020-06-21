'use strict'

var localVideo = document.querySelector('video#localvideo');
var remoteVideo = document.querySelector('video#remotevideo');
var btnStart = document.querySelector('button#start');
var btnCall = document.querySelector('button#call');
var btnHangup = document.querySelector('button#hangup');

var offer = document.querySelector('textarea#offer');
var answer = document.querySelector('textarea#answer')


var localStream;
var pc1;
var pc2;

function getMediaStream(stream) {
    localVideo.srcObject = stream
    localStream = stream
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

function getRemoteStream(e) {
    remoteVideo.srcObject = e.streams[0];
}

function getAnswer(desc) {
    pc2.setLocalDescription(desc);
    answer.value = desc.sdp;

    //send desc to signal
    //receive desc from signal
    pc1.setRemoteDescription(desc);
}

function getOffer(desc) {
    pc1.setLocalDescription(desc);
    offer.value = desc.sdp;

    //send desc to signal
    //receive desc from signal

    pc2.setRemoteDescription(desc);
    pc2.createAnswer()
        .then(getAnswer)
        .catch(handleAnswerError);
}

function call() {
    pc1 = new RTCPeerConnection(); //调用者
    pc2 = new RTCPeerConnection();  // 被调用者

    pc1.onicecandidate = (e) => {
        pc2.addIceCandidate(e.candidate);
    }

    pc2.onicecandidate = (e) => {
        pc1.addIceCandidate(e.candidate);
    }

    // 被调用者触发 ontrack事件
    pc2.ontrack = getRemoteStream;  //显示出远端的视频

    // 本地采集的音视频流添加到pc1
    localStream.getTracks().forEach((track)=>{
        pc1.addTrack(track, localStream);
    });


    //-- 媒体协商
    var offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1
    }
    pc1.createOffer(offerOptions) //创建本地的媒体信息
        .then(getOffer)
        .catch(handleOfferError);


}

function hangup() {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
}

btnStart.onclick = start;
btnCall.onclick = call;
btnHangup.onclick = hangup;