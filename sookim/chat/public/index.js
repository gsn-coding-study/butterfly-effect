var express = require("express");
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static('public'));


/*
app.get('/', function(req, res){
  res.sendFile(__dirname + '/public');
});
*/

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


function humanTalk(chatroom){

  var talk = document.getElementById('talk');
  var message = talk.value;

  if (message.length > 0)
  {

    var talkBox = document.createElement("div");
    talkBox.setAttribute('id', 'humanTalkBox');
    var span = document.createElement('span');
    span.setAttribute('id', 'human');
    var label = document.createElement('span');
    label.innerHTML = "나";
    label.setAttribute('id', 'humanLabel');
    span.innerHTML = message;

    talkBox.appendChild(span);
    talkBox.appendChild(label);
    chatroom.appendChild(talkBox);

    talk.value = "";

    setTimeout(function() {
      simsimTalk(chatroom, message);
    }, 2000);


  }
}

function simsimTalk(chatroom, message){

      var feedback = message;
  var talkBox = document.createElement("div");
  talkBox.setAttribute('id', 'simTalkBox');
  var span = document.createElement('span');
  span.setAttribute('id', 'sim');
  var label = document.createElement('span');
  label.innerHTML = "심심이";
  label.setAttribute('id', 'simLabel');
  switch(message){
    case '안녕' : feedback = "안녕하세용";
    break;
    case '뭐해?' : feedback = "님이랑 놀아주고 있잖아요";
    break;
    case '오늘 날씨 어때?' : feedback = "시리한테 물어보세요 헤헿";
    break;
    case '오늘 스케쥴이 뭐야?' : feedback = "출근과 퇴근입니다.";
    break;
    case '끝말잇기 하자' : feedback = "네. 저부터 할게요. 해질녘!";
    break;
    case '자비스' : feedback = "로버트 다우니 주니어";
    break;
    case '시리야' : feedback = "제 이름은 심심이입니다.(정색)";
    break;
    case '따라하지마' : feedback = "뭐가";
    break;
    case '그만하자' : feedback = "드디어 끝났네";
    break;
  }
  span.innerHTML = feedback;

    talkBox.appendChild(label);
    talkBox.appendChild(span);
    chatroom.appendChild(talkBox);

  }
