var five = require('johnny-five');
var fancy = require('colorize').console;
var emitter = require('events').EventEmitter;

var hardware = {};
hardware.config = process.config.arduino;
hardware.ready = false;
hardware.queue = [];
hardware.emitter = new emitter();

hardware._board = null;
if(!process.config.debug) {
  //Johnny Five Board
  hardware._board = new five.Board();
}

//Basic hardware components
hardware.powerLED = 1;
hardware.connectLED = 2;
hardware.lifeLEDs = hardware.config.leds.life;
hardware.powerLEDs = hardware.config.leds.stamina;
hardware.button = null;
hardware.powerPot = null;
hardware._power = 0;
hardware.powerIndicator = hardware.config.leds.power;
hardware.buzzer = null;

if(!process.config.debug || process.config.debug === false) {
  hardware._board.on('ready', function() {
    for(var l = 0; l < hardware.lifeLEDs.length; l++) {
      hardware.lifeLEDs[l] = new five.Led(hardware.lifeLEDs[l]);
    }

    for(var l = 0; l < hardware.lifeLEDs.length; l++) {
      hardware.powerLEDs[l] = new five.Led(hardware.powerLEDs[l]);
    }

    hardware.button = new five.Button(hardware.config.attack);
    hardware.button.on('up', function() {
      hardware.emitter.emit('attack', hardware._power);
    });

    hardware.powerPot = potentiometer = new five.Sensor({
      pin: hardware.config.power,
      freq: 250
    });

    hardware.powerIndicator = [
      new five.Led(hardware.powerIndicator[0]),
      new five.Led(hardware.powerIndicator[1]),
      new five.Led(hardware.powerIndicator[2])
    ];

    hardware.powerPot.scale(0, 99).on('read', function(err, value) {
      for(var i = 0; i < hardware.powerIndicator.length; i++) {
        hardware.powerIndicator[i].off();
      }

      if(this.scaled > 66) {
        hardware._power = 3;
        hardware.powerIndicator[0].on();
      } else if(this.scaled > 33) {
        hardware._power = 2;
        hardware.powerIndicator[0].on();
        hardware.powerIndicator[2].on();
      } else {
        hardware._power = 1;
        hardware.powerIndicator[2].on();
      }
    });

    hardware.ready = true;
    hardware.emitter.emit('ready');

    for(var q = 0; q < hardware.queue.length; q++) {
      hardware[hardware.queue[q].funct].apply(hardware, hardware.queue[q].args);
    }
  });
}

hardware.on = function(event, cb) {
  hardware.emitter.on(event, cb);
};

hardware.updateLife = function(life) {
  if(process.config.debug && process.config.debug === true) {
    var lStr = 'Life: #red[';
    for(var l = 0; l < life.length; l++) {
      for(var ll = 0; ll < life[l]; ll++) {
        lStr += '|';
      }
    }

    lStr += ']';
    fancy.log(lStr);
    return;
  }

  if(this.ready === false) {
    this.queue.push({funct:'updateLife',args: [].slice.call(arguments)});
    return;
  }

  for(var l = this.lifeLEDs.length - 1; l >= 0; l--) {
    hardware.lifeLEDs[l].off();
    hardware.lifeLEDs[l].stop();

    if(life[l] >= 2) {
      hardware.lifeLEDs[l].on();
    } else if(life[l] === 1) {
      hardware.lifeLEDs[l].strobe(200);
    }
  }
};

hardware.updatePower = function(power) {
  if(process.config.debug && process.config.debug === true) {
    var sStr = 'Stamina: #yellow['
    for(var p = 0; p < power; p++) {
      sStr += '|';
    }

    sStr += ']';
    fancy.log(sStr);
    return;
  }

  if(this.ready === false) {
    this.queue.push({funct:'updatePower',args: [].slice.call(arguments)});
    return;
  }

  for(var p = 0; p < this.powerLEDs.length; p++) {
    if(power >= p + 1) {
      hardware.powerLEDs[p].on();
    } else {
      hardware.powerLEDs[p].off();
    }
  }
};

hardware.die = function() {

};

hardware.test = function(maxPower) {
  hardware.emitter.emit('attack', Math.floor(Math.random() * (maxPower + 1)));
}

module.exports = hardware;