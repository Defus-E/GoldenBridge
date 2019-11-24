const nconf = require('nconf'); // Модуль nconf
const path = require('path'); // Модуль path

// Указываем путь нашего конфига
nconf.argv()
  	  .env()
     .file({ file: path.join(__dirname, 'config.json') });

module.exports = nconf;