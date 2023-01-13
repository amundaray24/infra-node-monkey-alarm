import { buzzer } from "../configurations/gpio_outputs_configuration.js";

const buzzerArmAlarmSound = async () => {
  let workCicle = 0;
  for (let i = 0; i < 2; i++) {;
    workCicle += 80;
    buzzer.pwmWrite(workCicle);
    await _sleep(100);
    buzzer.pwmWrite(255);
    await _sleep(100);
  }
}

const buzzerDisarmAlarmSound = async () => {
  buzzer.pwmWrite(190);
  await _sleep(100);
  buzzer.pwmWrite(255);
}

const buzzerAlarmDispatched = async () => {
  buzzer.pwmWrite(10);
  await _sleep(150);
  buzzer.pwmWrite(100);
  await _sleep(150);
  buzzer.pwmWrite(150);
  await _sleep(150);
  buzzer.pwmWrite(10);
  await _sleep(150);
  buzzer.pwmWrite(255);
}

const _sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  buzzerArmAlarmSound,
  buzzerDisarmAlarmSound,
  buzzerAlarmDispatched
}