const { createServer, proxy } = require('@netlify/functions');
const expressApp = require('../app.js'); // Import your Express app

exports.handler = createServer((req, res) => {
  expressApp(req, res, () => {
    proxy(req, res, expressApp);
  });
});
