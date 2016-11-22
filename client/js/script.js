'use strict';

((window) => {
  const Config = window.APP_CONFIG;
  const peer = Config.server ? new Peer(Config.roomId, Config.peer) : new Peer(Config.peer);

  const navigator = window.navigator;
  const md5 = (value) => window.CryptoJS.MD5(String(value)).toString();

  const $$ = (id) => document.getElementById(id);
  const smap = (array, iterator, sep = '') =>
    (array || []).map(iterator).join(sep);
  const getStreamUrl = (stream) =>
    window.URL.createObjectURL(stream);

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
  let friendPeerId = null;
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
    myPeerId = peer.id;
    console.log(myPeerId);
  });

  navigator.getUserMedia({ audio: true, video: true }, (stream) => {
    myStream = stream;
    $myVideo.src = getStreamUrl(stream);

    if (!Config.server) {
      connection = peer.connect(Config.roomId, { metadata: { peerId: peer.id } });
    }
  }, (err) => {
    console.log(err);
    alert('An error occured. Please try again');
  });

  peer.on('connection', (conn) => {
    connection = conn;

    friendPeerId = connection.peer;

    const call = peer.call(friendPeerId, myStream);

    call.on('stream', (friendStream) => {
      $friendVideo.src = getStreamUrl(friendStream);
    });
  });

  peer.on('call', (call) => {
    call.answer(myStream);

    call.on('stream', (friendStream) => {
      $friendVideo.src = getStreamUrl(friendStream);
    });
  });
})(window);
