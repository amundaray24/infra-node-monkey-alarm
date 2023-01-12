import { Gpio } from "pigpio";

const movementSensor = new Gpio(27, {mode: Gpio.INPUT, alert: true});

export {
  movementSensor
}