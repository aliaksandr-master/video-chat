'use strict';

((window) => {
  const Config = window.APP_CONFIG;
  const peer = Config.server ? new Peer(Config.roomId, Config.peer) : new Peer(Config.peer);

  const navigator = window.navigator;
  const getStreamUrl = (stream) =>
    window.URL.createObjectURL(stream);

  const $myVideo = document.getElementById('my-video');
  const $friendVideo = document.getElementById('peer-video');

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  let myStream = null;
  let myPeerId = null;
  let friendPeerId = null;
  let connection = null;

  peer.on('open', () => {
    myPeerId = peer.id;
  });

  navigator.getUserMedia({ audio: true, video: true }, (stream) => {
    myStream = stream;
    $myVideo.src = getStreamUrl(stream);

    if (!Config.server) {
      connection = peer.connect(Config.roomId, { metadata: { peerId: peer.id } });
    }
  }, (err) => {
    console.error(err);
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
