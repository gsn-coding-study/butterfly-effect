var Chat = (function (self) {
  var element = JS.element;
  var addEvent = JS.addEvent;
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
        msg.innerHTML = message;
      }
      msgbox.appendChild(msg);

      var label = element('span'); {
        label.classList.add('label', who);
        label.innerHTML = name;
      }
      msgbox.appendChild(label);
    }
    container.appendChild(msgbox);
  }

  function humanTalk(container, talk) {
    console.log(talk);
    var message = talk.value || '';

    if (message.length <= 0)
      return;

    msgbox(container, 'human', '나', message);

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

  return self;

}(Chat || {}));