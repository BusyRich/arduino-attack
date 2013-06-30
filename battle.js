//Node Modules
var express = require('express');
var app = express();

//Game files
var game = require('./game');
var hardware = require('./hardware');

var main = new game();
hardware.updateLife(main.life);
hardware.updatePower(main.power);
hardware.on('attack', function(power) {
  main.battle(power, function(err, success) {
    console.log(err || success);
  });
});

app.use(express.bodyParser());

app.get('/status', function(req, res) {
  res.send({life:main.life,power:main.power});
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
  if(isNaN(attack) || attack > 3 || attack < 0) {
    return res.send('Power must be a number between 0 and 3');
  }

  main.damage(attack);
  hardware.updateLife(main.life);
  hardware.updatePower(main.power);
  res.send();
});

app.post('/test/:power', function(req, res) {
  main.battle(parseInt(req.params.power), function(err, success) {
    if(err) {
      res.send('Error! ' + err);
    } else {
      res.send('Attack: ' + success);
    }
  });
});

var port = process.env.PORT || 9740;
app.listen(port);
console.log('Listening on port ' + port);