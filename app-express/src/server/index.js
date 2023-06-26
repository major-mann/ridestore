const http = require('http');
const app = require('./app');

(function startApp() {
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3001;

  server.listen(PORT, error => {
    if (error) {
      return console.log(error);
    }
    console.log('🚀 Server started on port ' + PORT);
  });
}());
