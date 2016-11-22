'use strict';

const throttle = (delay, method) => {
  let prevCallTimestamp = 0;
  let timer = 0;
  let count = 0;

  const apply = (that, args) => {
    prevCallTimestamp = Date.now();
    method.apply(that, args);

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return (...args) => {
    const now = Date.now();
    const that = this;

    count++;

    if (!prevCallTimestamp || now > (prevCallTimestamp + delay)) {
      count = 0;
      apply(that, args);

      timer = setTimeout(() => {
        timer = null;
        if (count) {
          count = 0;
          apply(that, args);
        }
      }, delay);
    }
  };
};

((window) => {
  const Config = window.APP_CONFIG;
  const peer = Config.server ? new Peer(Config.roomId, Config.peer) : new Peer(Config.peer);

  const navigator = window.navigator;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  let myStream = null;
  let myPeerId = null;

  let friendsCounter = 0;
  const friends = {};

  const connect = (peerId, connection) =>
    friends[peerId] = {
      peerId,
      connection,
      index: friendsCounter++
    };

  peer.on('open', () => {
    myPeerId = peer.id;

    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      myStream = stream;
      document.getElementById('my-video').src = window.URL.createObjectURL(stream);

      if (!Config.server) {
        connect(Config.roomId, peer.connect(Config.roomId, { metadata: { friendPeer: myPeerId } }));
      }
    }, (err) => {
      console.error(err);
      alert('An error occured. Please try again');
    });
  });

  const attachVideo = (index, stream) => {
    const camera = document.getElementById('peer-camera');
    const id = `peer-video-${index}`;

    let video = document.getElementById(id);

    if (!video) {
      camera.insertAdjacentHTML('beforeEnd', `<video id="${id}" autoplay></video>`);
      video = document.getElementById(id);
    }

    video.src = window.URL.createObjectURL(stream);

    for (const k in friends) {
      if (friends.hasOwnProperty(k)) {
        video = document.getElementById(`peer-video-${friends[k].index}`);

        video.style.width = `${(100/friendsCounter).toFixed(2)}%`;
      }
    }
  };

  peer.on('connection', (connection) => {
    const friend = connect(connection.peer, connection);

    const call = peer.call(connection.peer, myStream);

    call.on('stream', (stream) => {
      attachVideo(friend.index, stream);
    });
  });

  peer.on('disconnected', throttle(1000, () => {
    peer.reconnect();
  }));

  peer.on('call', (call) => {
    const friend = friends[call.peer];

    call.answer(myStream);

    call.on('stream', (stream) => {
      attachVideo(friend.index, stream);
    });
  });
})(window);
