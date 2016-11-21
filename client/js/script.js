'use strict';

const mainTemplate = () => `
  <div class="container">
    <div class="jumbotron">
      <h4>YOUR <b>ID</b>: <span id="my-peer-id"></span></h4>
      <h6>Friend: <span id="friend-email"></span></h6>

      <div class="b-video">
        <div id="peer-camera">
          <video id="peer-video" autoplay></video>
        </div>

        <div id="my-camera">
          <video id="my-video" autoplay></video>
        </div>      
      </div>

      <div id="messenger-wrapper">
        <form action="GET" id="login-form" class="row">
          <div class="col-xs-5">
            <input class="form-control" type="text" id="peer-id" placeholder="Friend ID (ask him)" required/>
          </div>
          <div class="col-xs-5">
            <input class="form-control" type="email" id="email" placeholder="Your Email" pattern="[a-z0-9A-Z_-.]+@[a-z0-9A-Z_.]+[.][a-z0-9A-Z]{1,3}" required/>
          </div>
          <div class="col-xs-2">
            <button class="btn btn-success btn-block" type="submit">Login</button>          
          </div>
        </form>

        <div id="chat" class="hidden">
          <div id="messages" class="b-messages"></div>
          <form action="GET" id="message-form">
            <textarea class="form-control" required type="text" name="message" id="message" placeholder="Message"></textarea>
            <button class="btn btn-success" type="submit">Send message</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  `;

((window) => {
  const Config = window.APP_CONFIG;
  const peer = new Peer(Config.peer);

  const navigator = window.navigator;
  const md5 = (value) => window.CryptoJS.MD5(String(value)).toString();

  const $$ = (id) => document.getElementById(id);
  const smap = (array, iterator, sep = '') =>
    (array || []).map(iterator).join(sep);
  const getStreamUrl = (stream) =>
    window.URL.createObjectURL(stream);

  document.body.insertAdjacentHTML('beforeBegin', mainTemplate());

  const $friendPeerId = $$('peer-id');
  const $myVideo = $$('my-video');
  const $loginForm = $$('login-form');
  const $email = $$('email');
  const $messages = $$('messages');
  const $messageForm = $$('message-form');
  const $messageInput = $$('message');
  const $friendUserEmail = $$('friend-email');
  const $friendVideo = $$('peer-video');
  const $myPearId = $$('my-peer-id');
  const $chat = $$('chat');

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  let myStream = null;
  let myPeerId = null;
  let myEmail = null;
  let friendPeerId = null;
  let friendEmail = null;
  let connection = null;

  let messages = [];
  const displayNewMessage = (message) => {
    messages.push(message);

    $messages.innerHTML = smap(messages, ({ email, text }) => `
      <div class="b-messages__item">
        <img class="b-message__item-avatar" title="${email}" src="https://secure.gravatar.com/avatar/${md5(email)}?d=mm&r=x&s=60"/>
        <span class="b-message__item-text">${String(text || '').trim()}</span>
      </div>
    `);
  };

  peer.on('open', () => {
    myPeerId = $myPearId.innerText = peer.id;
  });

  navigator.getUserMedia({ audio: true, video: true }, (stream) => {
    myStream = stream;
    $myVideo.src = getStreamUrl(stream);
  }, (err) => {
    console.log(err);
    alert('An error occured. Please try again');
  });



  const showChat = () => {
    $friendPeerId.classList.add('hidden');
    $chat.classList.remove('hidden');
  };



  $loginForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    myEmail = $email.value;

    connection = peer.connect($friendPeerId.value, {
      metadata: { 'email': myEmail, username: myEmail }
    });

    connection.on('data', displayNewMessage);

    showChat();
  });

  peer.on('connection', (conn) => {
    connection = conn;

    connection.on('data', displayNewMessage);

    friendPeerId = $friendPeerId.value = connection.peer;

    const call = peer.call(friendPeerId, myStream);

    call.on('stream', (friendStream) => {
      $friendVideo.src = getStreamUrl(friendStream);
    });

    friendEmail = $friendUserEmail.innerText = connection.metadata.email;
  });

  $messageForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    var message = { email: myEmail, text: $messageInput.value };

    connection.send(message);

    displayNewMessage(message);

    $messageInput.value = '';
  });

  peer.on('call', (call) => {
    call.answer(myStream);

    call.on('stream', (friendStream) => {
      $friendVideo.src = getStreamUrl(friendStream);
    });
  });
})(window);
