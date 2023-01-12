import { Gpio } from "pigpio";


//OUTPUTS
const buzzer = new Gpio(18, {mode: Gpio.OUTPUT});
buzzer.pwmWrite(255);

export {
  buzzer
}