'use strict'
var pc;

function createPeerConnection() {
    console.log('create RTCPeerConnection!');
    if (!pc){
        let pcConfig = {
            'iceServers': [{
                'urls':'turn:192.168.1.13:3478',
                'credential':'test',
                'username':'test'
            }]
        };
        pc = new RTCPeerConnection(pcConfig);
        pc.onicecandidate = (e)=>{
            if (e.candidate) {
                console.log('find an new candidate', e.candidate);
                sendMessage(roomid, {
                    type: 'candidate',
                    label: e.candidate.sdpMLineIndex,
                    id: e.candidate.sdpMid,
                    candidate: e.candidate.candidate
                });
            }
        }
        pc.ontrack = getRemoteStream;

        //通过 oniceconnectionstatechange 方法来监测 ICE 连接的状态，它一共有七种状态
        /*new        ICE代理正在收集候选人或等待提供远程候选人。
        checking   ICE代理已经在至少一个组件上接收了远程候选者，并且正在检查候选但尚未找到连接。除了检查，它可能还在收集。
        connected  ICE代理已找到所有组件的可用连接，但仍在检查其他候选对以查看是否存在更好的连接。它可能还在收集。
        completed  ICE代理已完成收集和检查，并找到所有组件的连接。
        failed     ICE代理已完成检查所有候选对，但未能找到至少一个组件的连接。可能已找到某些组件的连接。
        disconnected ICE 连接断开
        closed      ICE代理已关闭，不再响应STUN请求。*/
        pc.oniceconnectionstatechange = (e) => {
            console.log('ICE connection state change: ',e.timeStamp);
        };
    }

}

function closePeerConnection() {
    console.log('close RTCPeerConnection!');
    if (pc) {
        pc.close();
        pc = null;
    }
}

function handleOfferError(err) {
    console.error('Faile to create Offer!', err);
}

function sendMessage(roomid, data) {
    //console.log('send p2p message:', roomid, data)
    if (socket) {
        socket.emit('message', roomid, data);
    }
}

function getRemoteStream(e) {
    remoteVideo.srcObject = e.streams[0];
}

function getOffer(desc) {
    pc.setLocalDescription(desc);
    offer.value = desc.sdp;

    sendMessage(roomid, desc);

}

function call() {
    if (state === JOINED_CONN) {
        if (pc) {
            let options = {
                offerToReceiveAudio: 0,
                offerToReceiveVideo: 1
            };

            pc.createOffer(options)
                .then(getOffer)
                .catch(handleOfferError)
        }
    }
}

function bindTracks() {
    console.log('bind tracks into RTCPeerConnection!');

    if( pc === null || pc === undefined) {
        console.error('pc is null or undefined!');
        return;
    }

    if(localStream === null || localStream === undefined) {
        console.error('localstream is null or undefined!');
        return;
    }

    // 本地采集的音视频流添加到pc
    if (localStream) {
        localStream.getTracks().forEach((track)=>{
            pc.addTrack(track, localStream);
        });
    }
}