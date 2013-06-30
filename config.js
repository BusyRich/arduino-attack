module.exports = {
  debug: true,
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
      life: [1,2,3],
      stamina: [4,5,6],
      power: [7,8,9]
    },
    attack: 10,
    power: 'A0'
  }
};