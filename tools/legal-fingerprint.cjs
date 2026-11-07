const crypto = require('node:crypto');

// Git checks out CRLF on some Windows systems and LF on Linux runners.
// Line-ending conversion is not a change to the translated document.
module.exports = article => crypto.createHash('sha256')
  .update(article.replace(/\r\n?/g, '\n'))
  .digest('hex');
