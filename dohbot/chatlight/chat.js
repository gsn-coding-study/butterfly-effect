var Chat = (function (self) {
  var element = JS.element;
  var addEvent = JS.addEvent;
  var get = JS.get;
  var replies = Replies;

  self.init = function (stdin, stdout) {

    stdin.classList.add('stdin'); {
      var text = element('input', {
        'type': 'text'
      });
      stdin.appendChild(text);

      var send = element('button');
      send.innerHTML = 'Talk!';
      stdin.appendChild(send);
    }

    stdout.classList.add('stdout');

    addEvent(send, 'click', function (e) {
      humanTalk(stdout, text);
    });
    addEvent(text, 'keypress', function (e) {
      //if 'Enter' pressed
      if (13 == e.keyCode) humanTalk(stdout, text);
    });
  }

  function msgbox(container, who, name, message) {

    var msgbox = element('div'); {

      msgbox.classList.add('msg', who);
      var msg = element('span'); {
        msg.classList.add('msg', who);
        msg.innerHTML = emojify.replace(message);
      }
      msgbox.appendChild(msg);
      msgbox.app

      var label = element('span'); {
        label.classList.add('label', who);
        label.innerHTML = name;
      }
      msgbox.appendChild(label);
    }
    container.appendChild(msgbox);
    container.scrollTop = container.scrollHeight;
  }

  function humanTalk(container, talk) {
    var message = talk.value || '';

    if (message.length <= 0)
      return;

    msgbox(container, 'human', '나', message);
    if (sender) sender.send(message);
    talk.value = '';

    setTimeout(function () {
      botTalk(container, message);
    }, 300);
  };

  function botTalk(container, message) {
    var reply = null;

    for (var p in replies) {
      if (message.match(new RegExp(p, 'g'))) {
        reply = replies[p];
        break;
      }
    }
    reply = reply || message;
    msgbox(container, 'bot', '봇', reply);
  };

  //webrtc exam

  //create conn        
  var servers = {
    "iceServers": [{
      "url": "stun:stun2.1.google.com:19302"
    }]
  };
  var local = new RTCPeerConnection(servers, null);
  var sender = local.createDataChannel('send', null);
  local.onicecandidate = function (e) {
    onIceCandidate(local, e);
  };
  sender.onopen = sender.onclose = function () {
    console.log('send state : ', sender.readyState);
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

      //TODO 데이터를 넘겨줄 것
      // event.data;
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
    sender.send(data);
    console.log('send data:', data);
  }
  // JS.addEvent(JS.get('create'), 'click', function (e) {
  //   sender.send(JS.get('stdout').innerHTML);
  // });

  function onSendStateChange() {
    var state = sender.readyState;
    console.log('send state is ', state);
  }

  return self;

}(Chat || {}));