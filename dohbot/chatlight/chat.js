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

    talk.value = '';
    setTimeout(function () {
      sendMsg(message);
    }, 100);
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
  var servers = {
    "iceServers": [{
      "url": "stun:stun2.1.google.com:19302"
    }]
  };
  var webrtc = {
    isHost: true,
    local: null,
    chan: null,
    candidate: null
  };

  self.invite = function (idout, iceout) {
    webrtc.isHost = true;
    var conn = new RTCPeerConnection(servers, null);
    var chan = conn.createDataChannel('chat', null);
    webrtc.chan = chan;
    webrtc.local = conn;

    chan.onmessage = onMessage;
    chan.onopen = chan.onclose = onStatus;
    conn.onicecandidate = onCandidate(iceout);
    conn.createOffer().then(function (desc) {
      console.log('create offer:', desc);
      webrtc.local.setLocalDescription(desc);
      share(JSON.stringify({
        desc: desc,
        candidate: webrtc.candidate
      }), function (res) {
        var v = JSON.parse(res);
        idout.value = v.key;
      });
    }, console.log);
  }

  self.join = function (idout, iceout, remoteid) {
    webrtc.isHost = false;
    var conn = new RTCPeerConnection(servers, null);
    webrtc.local = conn;

    conn.ondatachannel = function (event) {
      var chan = event.channel;
      webrtc.chan = chan;

      chan.onmessage = onMessage;
      chan.onopen = chan.onclose = onStatus;
    };

    getDesc(remoteid, function (json) {
      var meta = JSON.parse(json);
      // conn.addIceCandidate(meta.candidate).then(function () {
      //   console.log('success to add ice candidate');
      // }, console.log);
      conn.setRemoteDescription(meta.desc);
      conn.onicecandidate = onCandidate(iceout);
      conn.createAnswer().then(function (desc) {
        console.log('create answer:', desc);
        webrtc.local.setLocalDescription(desc);
        share(JSON.stringify({
          desc: desc,
          //candidate: webrtc.candidate
        }), function (res) {
          var v = JSON.parse(res);
          idout.value = v.key;
        });
      }, console.log);
    });
  }

  self.start = function (remoteid, iceid) {
    if (webrtc.isHost) {
      getDesc(remoteid, function (json) {
        var meta = JSON.parse(json);
        webrtc.local.setRemoteDescription(meta.desc);
      });
    }
    if (iceid) {
      getDesc(iceid, function (json) {
        var meta = JSON.parse(json);
        console.log('meta:', json);
        webrtc.local.addIceCandidate(meta.candidate).then(function () {
          console.log('success to add ice candidate');
        }, console.log);
      });
    }
  }

  function sendMsg(msg) {
    console.log('send', webrtc.chan.readyState, msg);
    if (webrtc.chan && 'open' == webrtc.chan.readyState)
      webrtc.chan.send(msg);
  }

  function onStatus() {
    console.log('chann state : ', webrtc.chann.readyState);
  }

  function onMessage(event) {
    msgbox(get('stdout'), 'bot', '원격', event.data);
  }

  function onCandidate(iceout) {
    return function (event) {      
      webrtc.candidate = event.candidate;
      console.log('on candidate : ', event.candidate);
      share(JSON.stringify({
        candidate: event.candidate
      }), function (res) {
        var v = JSON.parse(res);
        iceout.value = v.key;
      });
    }
  }

  function share(json, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://o18y4g5m2m.execute-api.ap-northeast-2.amazonaws.com/v1', true);
    xhr.onreadystatechange = function () {
      //console.log(this.status, this.readyState, this.responseText.length);
      if (200 == this.status && 4 == this.readyState)
        cb(this.responseText);
    };
    xhr.send(json);
  }

  function getDesc(id, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o18y4g5m2m.execute-api.ap-northeast-2.amazonaws.com/v1/' + id, true);
    xhr.onreadystatechange = function () {
      //console.log(this.status, this.readyState, this.responseText.length);
      if (200 == this.status && 4 == this.readyState)
        cb(this.responseText);
    };
    xhr.send();
  }

  return self;

}(Chat || {}));