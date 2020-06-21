[TOC]
## WebRtc js client
这是一个webrtc的学习笔记

## 目录结构
Docker/  运行环境

webserver/http  测试用的http（无用）

webserver/https  web环境/
    http端口 8887
    https端口 8888
    
webserver/cert 证书

webserver/public 静态资源目录

## 运行
依赖
```
npm install express serve-index socket.io log4js  -g
```
进入webserver/https/目录
```
cd webserver/https && node server.js
```
访问
```
https://127.0.0.1:8888/MediaStream/index.html
```
## TODO LIST
- [x] 设备管理 webserver/public/MediaStream/index.html

- [x] 捕获音视频 webserver/public/MediaStream/getdevice.html

- [x] 给视频加上特效 webserver/public/MediaStream/index.html

- [x] 从视频中截取图片 webserver/public/MediaStream/index.html

- [x] 采集桌面数据 webserver/public/MediaStream/index.html

- [x] 录制音视频 webserver/public/MediaStream/index.html

- [x] 聊天室 webserver/public/chatroom/index.html

- [x] 本地回环 webserver/public/peer/index.html

- [x] SDP实战 webserver/public/testCreateOffer/index.html

- [x] 搭建ICE Docker/docker-compose.yaml

- [x] 信令服务器 webserver/public/server.js

- [x] 1v1端对端传输 webserver/public/live/room.html

- [x] 码率控制 webserver/public/bandwidth/index.html

- [ ]  webrtc统计信息

## 码率控制
通过`chrome://webrtc-internals/`查看.

## 搭建ICE
### 使用docker搭建
编写docker-compose:
```
version: '3'
services:
coturn:
    image: instrumentisto/coturn
    tty: true
    container_name: coturn_test
    volumes:
    - ./:/etc/coturn/
    ports:
    - 3478:3478
    - 3478:3478/udp
    command: /bin/sh -c "turnserver -c /etc/coturn/turnserver.conf"
```
编写turnserver.conf:
```
#中继服务器监听的IP地址，NAT环境下直接写私网IP地址，可以指定多个IP
listening-ip=0.0.0.0
#中继服务器转发地址(本地IP地址将用于传递数据包的给每个端)，和监听地址一样
#relay-ip=60.70.80.91
#外部IP,NAT环境下直接写：公网IP/私网IP
external-ip=192.168.1.13/192.168.1.13
#打开fingerprint的注释，使用长期证书机制。
fingerprint
#打开密码验证，使用短期证书机制。
lt-cred-mech
#服务器名称,用于OAuth认证,默认和realm相同,直接填公网ip.部分浏览器本段不设可能会引发cors错误。
server-name=192.168.1.13
# TURN REST API的长期凭证机制范围，同样设为ip,同server-name.
realm=192.168.1.13
#移动的ICE(MICE)的规范支持。
mobility
#快捷的添加用户是使用user=XXX:XXXX的方式，可以添加多个。/var/db/turndb也工作，可以使用turnadmin来管理其中用户，可以添加多个。
user=test:test
```
### 检测是否搭建好
可以使用一段简单的检查代码，检查代码如下，直接在chrome浏览器的console执行即可:

```
function checkTURNServer(turnConfig, timeout){ 

  return new Promise(function(resolve, reject){

    setTimeout(function(){
        if(promiseResolved) return;
        resolve(false);
        promiseResolved = true;
    }, timeout || 5000);

    var promiseResolved = false
      , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
      , pc = new myPeerConnection({iceServers:[turnConfig]})
      , noop = function(){};
    pc.createDataChannel("");    //create a bogus data channel
    pc.createOffer(function(sdp){
      if(sdp.sdp.indexOf('typ relay') > -1){ // sometimes sdp contains the ice candidates...
        promiseResolved = true;
        resolve(true);
      }
      pc.setLocalDescription(sdp, noop, noop);
    }, noop);    // create offer and set local description
    pc.onicecandidate = function(ice){  //listen for candidate events
      if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
      promiseResolved = true;
      resolve(true);
    };
  });   
}

checkTURNServer({
    url: 'turn:192.168.1.13',
    username: 'test',
    credential: 'test'
}).then(function(bool){
    console.log('is TURN server active? ', bool? 'yes':'no');
}).catch(console.error.bind(console));
```

将`checkTURNServer`的地址换为真实地址，用户名密码修改为真实的即可

使用上面的检查代码，检查，返回is TURN server active? yes说明正确，返回no说明有错误。

## 我的看云地址
https://www.kancloud.cn/idzqj/customer/755817


