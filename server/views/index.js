'use strict';

module.exports = () => {

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
  <div class="container b-index-page">
    <div class="jumbotron b-index-pag__content" style="text-align: center;">
      <script>document.write('<a class="btn btn-lg btn-primary" href="/rf/' + Date.now().toString(36) + Math.floor(Math.random() * 100000000).toString(36) + '">New Private Chat Room</a>')</script>
    </div>
    <div class="b-road-map"><a class="b-road-map__link" href="https://trello.com/b/0Js6Oeln" target="_blank">Road Map (Trello)</a></div>
  </div>
</body>
</html>
  `;
};
