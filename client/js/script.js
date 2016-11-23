'use strict';

((window) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const meter = audioContext.createScriptProcessor(512);

  const $$ = (id) => document.getElementById(id);

  const initVolumeMeter = function (canvas, stream) {
    const WIDTH = canvas.width = canvas.offsetWidth;
    const HEIGHT = canvas.height = canvas.offsetHeight;
    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    const canvasContext = canvas.getContext("2d");

    meter.onaudioprocess = function (event) {
      var buf = event.inputBuffer.getChannelData(0);
      var bufLength = buf.length;
      var sum = 0;
      var x;

      for (var i = 0; i < bufLength; i++) {
        x = buf[i];
        sum += x * x;
      }

      this.volume = Math.max(Math.sqrt(sum / bufLength), this.volume * 0.95);
    };
    meter.volume = 0;
    meter.connect(audioContext.destination);
    meter.shutdown = function () {
      this.disconnect();
      this.onaudioprocess = null;
    };

    mediaStreamSource.connect(meter);

    const drawLoop = () => {
      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
      const height = meter.volume * HEIGHT * 1.4;
      canvasContext.fillStyle = (HEIGHT - height) < (0.2 * HEIGHT) ? 'rgba(255,0,0,0.5)' : 'rgba(0,255,0,0.5)';
      canvasContext.fillRect(0, HEIGHT - height, WIDTH, height);
      window.requestAnimationFrame(drawLoop);
    };

    drawLoop();
  };


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
      $$('my-video').src = window.URL.createObjectURL(stream);

      initVolumeMeter($$('my-video-volume'), stream);

      if (!Config.server) {
        connect(Config.roomId, peer.connect(Config.roomId, { metadata: { friendPeer: myPeerId } }));
      }
    }, (err) => {
      console.error(err);
      alert('An error occured. Please try again');
    });
  });

  const attachVideo = (index, stream) => {
    const camera = $$('peer-camera');
    const videoId = `peer-video-${index}`;
    const cavasId = `peer-video-${index}-volume`;

    let video = $$(videoId);

    if (!video) {
      camera.insertAdjacentHTML('beforeEnd', `<video id="${videoId}" autoplay></video><canvas id="${cavasId}" />`);
      video = $$(videoId);
      const canvas = $$(cavasId);

      initVolumeMeter(canvas, stream);
    }

    video.src = window.URL.createObjectURL(stream);

    for (const k in friends) {
      if (friends.hasOwnProperty(k)) {
        video = $$(`peer-video-${friends[k].index}`);

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
