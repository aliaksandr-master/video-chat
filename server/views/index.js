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
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>

<div class="container">
  <div class="jumbotron" style="text-align: center;">
    <script>document.write('<a class="btn btn-large btn-success" href="/rf/' + Date.now().toString(36) + Math.floor(Math.random() * 100000000).toString(36) + '">Create New Room</a>')</script>
  </div>
</div>
</body>
</html>
  `;
};
