import { createRequire } from "module";
const require = createRequire(import.meta.url);
const version = require('../../package.json');

import { 
  clearDisplay,
  displayStringLine
} from "../configurations/i2c_configuration.js";

const displayInvalidPasswordMessage = (tries) => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('!clave invalida!',1);
    await displayStringLine(`Intentos Disp:${tries}`,2);
    await _sleep(1000);
    await clearDisplay(false);
    resolve();
  });
}

const displayAlarmDispatchMessage = () => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('Alarma Disparada',1);
    await displayStringLine('!Mov Detectados!',2);
    await _sleep(1000);
    await clearDisplay(false);
    resolve();
  });
}

const displayDisarmAlarmMessage = () => {
  return new Promise( async (resolve) => {
    await _sleep(1000);
    await clearDisplay(true);
    await displayStringLine('Alarma Desarmada',1);
    await displayStringLine('!  Bienvenid@  !',2);
    await _sleep(2000);
    await clearDisplay(false);
    resolve();
  });
}

const displayArmAlarmMessage = () => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('  Alarma Armada  ',1);
    let timeToArm = 5;
    for (let i = timeToArm; i >= 1; i--) {
      await displayStringLine(`Armada en: ${i}seg`,2);
      await _sleep(1000);
    }
    await clearDisplay(false);
    resolve();
  });
}

const initLcd = () => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('  Monkey Alarm  ',1);
    await displayStringLine(`     v${version.version}     `,2);
    await _sleep(1000);
    await clearDisplay(false);
    resolve();
  });
}

const _sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export {
  initLcd,
  displayArmAlarmMessage,
  displayDisarmAlarmMessage,
  displayAlarmDispatchMessage,
  displayInvalidPasswordMessage
}