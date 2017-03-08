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
    // setTimeout(function () {
    //   sendData(message);
    // }, 300);
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
    local: null,
    chan: null,
    candidate: null
  };

  function invite(idout) {
    var local = new RTCPeerConnection(servers, null);
    var chan = local.createDataChannel('chat', null);
    chan.onopen = chan.onclose = function () {
      console.log('channel state : ', chan.readyState);
    };
    // chan.ondatachannel
    local.onicecandidate = onCandidate(local.createOffer());
    webrtc.local = local;
    webrtc.chan = chan;
  }

  function join(idout, remoteid) {
    var local = new RTCPeerConnection(servers, null);
    local.onicecandidate = onCandidate();
    setRemoteDescription
  }

  function onCandidate(promise) {
    return function (event) {
      webrtc.candidate = event.candidate;
      promise
        .then(
          function (desc) {
            share(JSON.stringify({
              desc: desc,
              candidate: webrtc.candidate
            }), function (id) {
              idout.value = id;
            });
          },
          console.log
        );
    }
  }

  function share(json, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', 'https://o18y4g5m2m.execute-api.ap-northeast-2.amazonaws.com/v1', true);
    xhr.onreadystatechange = function () {
      console.log(this.status, this.readyState, this.responseText);
      if (200 == this.status && 4 == this.readyState)
        cb(this.responseText);
    };
    xhr.send(json);
  }

  function getSignal(id, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://o18y4g5m2m.execute-api.ap-northeast-2.amazonaws.com/v1/' + id, true);
    xhr.onreadystatechange = function () {
      console.log(this.status, this.readyState, this.responseText);
      if (200 == this.status && 4 == this.readyState)
        cb(this.responseText);
    };
    xhr.send();
  }

  return self;

}(Chat || {}));