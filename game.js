var hitMax = 1000000;
var hitRanges = [];
for(var h = 0; h <= process.config.game.stamina; h++) {
  if(h < process.config.game.hitRanges.length) {
    hitRanges.push(hitMax * process.config.game.hitRanges[h]);
  }
}

var game = function() {
  this.request = require('request');
  this.config = process.config.game;

  //Game stats
  this.life = [];
  for(var l = 0; l < this.config.hearts; l++) {
    this.life.push(this.config.heartValue);
  }

  this.stamina = this.config.stamina;

  //Opponent connection information
  this.connected = false;
  this.opponent = {
    host: 'localhost',
    port: '9740'
  };
};

game.prototype._attack = function(power) {
  return (Math.floor(Math.random() * hitMax) < hitRanges[power]);
};

game.prototype.battle = function(power, callback) {
  if(power > this.stamina) {
    power = this.stamina;
  }

  if(this._attack(power)) {
    this.request({
      uri: 'http://' + this.opponent.host + ':' + this.opponent.port + '/attack/' + power,
      method: 'POST'
    }, function(error, response, body) {
      if(error) {
        return callback(error, null);
      }

      if(body && body.length > 0) {
        return callback(body, null);
      }

      callback(null, true);
    });
  } else {
    callback(null, false);
  }
};

game.prototype.damage = function(damage) {
  if(damage === this.config.stamina && this.stamina > 0) {
    this.stamina -= 1;
  }

  for(var a = this.life.length - 1; a >= 0; a--) {
    if(damage < 1) {
      break;
    }

    if(this.life[a] === 0) {
      continue;
    }

    if(this.life[a] >= damage) {
      this.life[a] -= damage;
      damage = 0;
    } else {
      damage -= this.life[a];
      this.life[a] = 0;
    }
  }

  if(this.life[0] === 0) {
    return false;
  } else {
    return true;
  }
};

module.exports = game;