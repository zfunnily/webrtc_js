'use strict'

var audioSource = document.querySelector('select#audioSource')
var audioOutput = document.querySelector('select#audioOutput')
var videoSource = document.querySelector('select#videoSource')

if (!navigator.mediaDevices ||
    !navigator.mediaDevices.enumerateDevices() ||
    !navigator.mediaDevices.getUserMedia()){
    console.log('enumerateDevices is not supported!');
    console.log('getUserMedia is not supported!');
}else {
    //navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(r => handleError);
    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices1)
        .catch(handleError)
}

function gotDevices1(deviceInfos) {
    deviceInfos.forEach(function (deviceInfo) {
        console.log(deviceInfo.kind
                    + ": label = " + deviceInfo.label
                    + ": id = " + deviceInfo.deviceId
                    + ": groupId = " + deviceInfo.groupId);
        var option = document.createElement('option');
        option.text = deviceInfo.label;
        option.value = deviceInfo.deviceId;

        if (deviceInfo.kind === 'audioinput') {
            audioSource.appendChild(option)
        }else if (deviceInfo.kind === 'audiooutput') {
            audioOutput.appendChild(option)
        }else if (deviceInfo.kind === 'videoinput') {
            videoSource.appendChild(option)
        }
    });
}

function handleError(err) {
     console.log(err.name + ": " + err.message)
}


