//create conn        
var servers = {
  "iceServers": [{
    "url": "stun:stun2.1.google.com:19302"
  }]
};
var local = new RTCPeerConnection(servers, null);
var sender = local.createDataChannel('sender', null);
local.onicecandidate = function (e) {
  onIceCandidate(local, e);
};
sender.onopen = sender.onclose = function () {
  console.log('sender state : ', sender.readyState);
};
var remote = new RTCPeerConnection(servers, null);

remote.onicecandidate = function (e) {
  onIceCandidate(remote, e);
};
var recver = null;
remote.ondatachannel = function (event) {
  recver = event.channel;
  recver.onmessage = function (event) {
    // console.log('recved msg: ', event.data);
    msgbox(get('stdout'), 'bot', '원격', event.data);
  };
  recver.onopen = recver.onclose = function () {
    console.log('recv state : ', sender.readyState);
  };
};

function onIceCandidate(conn, event) {
  function success() {
    console.log('AddIceCandidate success');
  }

  function fail(err) {
    console.log('AddIceCandidate fail:', err.toString());
  }
  [local, remote].filter(function (v) {
    return conn !== v;
  }).pop().addIceCandidate(event.candidate).then(success, fail);
}

function onDescError(err) {
  console.log('fail to create session desc', err.toString());
}

function localDesc(desc) {
  local.setLocalDescription(desc);
  console.log('offer from local: ', desc.sdp);
  remote.setRemoteDescription(desc);
  remote.createAnswer().then(remoteDesc, onDescError);
}

function remoteDesc(desc) {
  remote.setLocalDescription(desc);
  console.log('answer from remote: ', desc.sdp);
  local.setRemoteDescription(desc);
}

local.createOffer().then(localDesc, onDescError);

function sendData(data) {
  if (!sender || "open" != sender.readyState)
    return;
  sender.send(data);
}

function onSendStateChange() {
  var state = sender.readyState;
  console.log('send state is ', state);
}