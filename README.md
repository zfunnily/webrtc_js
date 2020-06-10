[TOC]
## WebRtc js client
这是一个webrtc的学习笔记

## 目录结构
Docker/  运行环境

webserver/http  测试用的http（无用）

webserver/https  web环境/
    http端口 7887
    https端口 8888
    
webserver/cert 证书

webserver/public 静态资源目录

## 运行
依赖
```
npm install express serve-index -g
```
进入webserver/https/目录
```
cd webserver/https && node server.js
```
访问
```
https://127.0.0.1:7888/MediaStream/index.html
```
## todo_list
- [x] 设备管理

- [x] 捕获音视频

- [x] 给视频加上特效

- [x] 从视频中截取图片

- [x] 采集桌面数据

- [x] 录制音视频

- [x] 聊天室

- [x] 本地回环

- [ ] 信令服务器

- [ ] 端对端传输




