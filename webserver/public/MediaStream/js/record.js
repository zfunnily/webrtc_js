
// 录制视频的四个按钮
var recvideo = document.querySelector('video#recplayer');
var btnRecord = document.querySelector('button#record');
var btnPlay = document.querySelector('button#recplay');
var btnDownload = document.querySelector('button#download');
//录制视频的数据
var buffer;
var mediaRecorder;

function handleDataAvilable(e) {
    if (e && e.data && e.data.size > 0) {
        buffer.push(e.data);
    }
}

function startRecord() {

    buffer = [];

    var options = {
        memeType: 'video/webm;codecs=vp8'
    }
    if (!MediaRecorder.isTypeSupported(options.memeType)) {
        console.error('${options.memeType} is not suttported');
        return;
    }

    try {
        mediaRecorder = new MediaRecorder(stream, options);
    }catch (e) {
        console.error('Failed to create MediaRecorder:', e);
    }
    mediaRecorder.ondataavailable = handleDataAvilable;
    mediaRecorder.start(10);
}

function stopRecord() {
    mediaRecorder.stop();
}


//录制视频按钮点击事件
btnRecord.onclick =  ()=> {
    if (btnRecord.textContent === 'Start Record') {
        startRecord();
        btnRecord.textContent = 'Stop Record';
        btnPlay.disabled = false;
        btnDownload.disabled = false;
    }else {
        stopRecord();
        btnRecord.textContent = 'Start Record';
        // btnPlay.disabled = true;
        // btnDownload.disabled = true;
    }
};

btnPlay.onclick = ()=> {
    var blob = new Blob(buffer, {type: 'video/webm'});
    recvideo.src = window.URL.createObjectURL(blob);
    recvideo.srcObject = null;
    recvideo.controls = true;
    recvideo.play();
}

// 下载按钮
btnDownload.onclick = ()=> {
    var blob = new Blob(buffer, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');

    a.href = url;
    a.style.display = 'none';
    a.download = 'aaa.webm';
    a.click();
}