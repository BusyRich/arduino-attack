//Node Modules
var express = require('express');
var app = express();

//Load in the config file
process.config = require('./config');

//Colored console
var fancy = require('colorize').console;

//Game files
var game = require('./game');
var hardware = require('./hardware');

var main = new game();
hardware.updateLife(main.life);
hardware.updateStamina(main.stamina);
hardware.on('attack', function(power) {
  main.battle(power, function(err, success) {
    if(err) {
      return fancy.log('#red[' + err + ']');
    }

    var aStr = 'Attack ' + power + ' ';
    if(success) {
      aStr += '#green[success]';
    } else {
      aStr += '#red[fail]';
    }

    fancy.log(aStr);
    console.log('--------------------------------');
  });
});

app.use(express.bodyParser());

app.get('/status', function(req, res) {
  res.send({life:main.life,stamina:main.stamina});
});

app.post('/connect', function(req, res) {
  if(req.body.host && req.body.port) {
    main.opponent = {
      host: req.body.host,
      port: req.body.port
    };
    res.send();
  } else {
    res.send('Invalid params');
  }
});

app.post('/attack/:power', function(req, res) {
  var attack = parseInt(req.params.power);
  if(isNaN(attack) || attack > process.config.game.stamina || attack < 0) {
    return res.send('Power must be a number between 0 and ' + process.config.game.stamina);
  }

  console.log('Damage ' + attack);
  main.damage(attack);
  hardware.updateLife(main.life);
  hardware.updateStamina(main.stamina);
  res.send();
});

app.post('/test', function(req, res) {
  hardware.test(main.stamina);
  res.send('Test Battle Initiated');
});

var port = process.env.PORT || 9740;
app.listen(port);
console.log('Listening on port ' + port);