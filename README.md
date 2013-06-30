# Arduino Attack!
Arduino Attack is a small, simple, network-enabled game that uses Arduino (using [johnny five](https://github.com/rwldrn/johnny-five)) as the controller and basic interface. However, it does have a debug mode that does not require an Arduino. **[watch it in action!](http://www.youtube.com/watch?v=1NalU4d7a20)**

## The Game
The core is a simple game that uses a simple API for all of its interaction. You can make requests against its API and it will work as expected. The rules are outlined as below, but all numbers (life, power, max power, etc.) are configurable.

* You start with 6 life and 3 stamina
* Reduce the other players life to 0 to "defeat" them
* Stamania determines the max power attack you can make
    * Example: If I have 3 stamina, the max amount of damage I can do is 3
* A succesful attack for max damage possible will cause 1 stamina damage

In theory the game should be able to be played across a network, since it is just a simple API over HTTP. This has not been tested.

## Arduino
The UI is made up of 6 normal LEDs and one RGB LED. The controls are one attack button and a simple potentiometer for selecting your attack power. The pins for each are part of the configuration, which is outlined below.

```javascript
leds.life = [1,2,3] //Pins for the leds, from lowest value to highest
leds.stamina = [1,2,3] //Same idea as life leds
leds.power = [1,2,3] //Pins for the RGB led to indicate attack power, in the order [R,G,B]
attack = 1 //Pin for the attack button
power = 'A0' //The analog pin of the potentiometer
```