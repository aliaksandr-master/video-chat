'use strict';

module.exports = ({ roomId, server }) => {

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta>
  <title>Messenger</title>

  <!-- Client -side dependencies -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <link rel="stylesheet" href="/client/css/style.css">
</head>
<body>

<div class="container">
  <a href="/">Home</a>
  <div class="jumbotron">
    <div>
    <label class="form-label">Link for friend:</label>
    <script>document.write('<input class="form-control" value="' + window.location.protocol + '//' + window.location.host + '/room/affiliated/${roomId}"/>');</script>
    </div>
    <br/>
    <br/>

    <div class="b-video">
      <div id="peer-camera">
        <video id="peer-video" autoplay></video>
      </div>

      <div id="my-camera">
        <video id="my-video" autoplay muted></video>
      </div>
    </div>
  </div>
</div>

<script>
  window.APP_CONFIG = {
    roomId: '${roomId}',
    server: ${JSON.stringify(server)},
    peer: {
      host: '/',
      path: '/peer',
      port: Number(window.location.port || 80),
      debug: window.location.protocol === 'https:' ? 2 : 3,
      secure: window.location.protocol === 'https:'
    }
  }
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/core-min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/md5-min.js"></script>
<script src="/client/js/peer.js"></script>
<script src="/client/js/script.js"></script>
</body>
</html>
  `;
};
