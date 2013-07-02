module.exports = {
  debug: false,
  game: {
    hearts: 3,
    heartValue: 2,
    stamina: 3,
    hitRanges: [
      0.10,
      0.50,
      0.30,
      0.05
    ]
  },
  arduino: {
    leds: {
      life: [2,3,4],
      stamina: [5,6,7],
      power: [9,10,11]
    },
    attack: 8,
    power: 'A0'
  }
};