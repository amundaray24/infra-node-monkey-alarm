import { createRequire } from "module";
const require = createRequire(import.meta.url);
const version = require('../../package.json');

import { 
  moveCursorHome,
  moveCursorLine,
  clearDisplay,
  clearLine,
  displayStringLine
} from "../configurations/i2c_configuration.js";

const displayAlarmDispatchMessage = () => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('!Alarm Dispatch!',1);
    await displayStringLine('Movement-Detect',2);
    await _sleep(2000);
    await clearDisplay(false);
    resolve();
  });
}

const displayDisarmAlarmMessage = () => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('Alarm Deactivated',1);
    await displayStringLine('! Welcome Back !',2);
    await _sleep(2000);
    await clearDisplay(false);
    resolve();
  });
}

const displayArmAlarmMessage = () => {
  return new Promise( async (resolve) => {
    await clearDisplay(true);
    await displayStringLine('Alarm Activated',1);
    let timeToArm = 5;
    for (let i = timeToArm; i >= 1; i--) {
      await displayStringLine(`Armed on: ${i} sec`,2);
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
  displayAlarmDispatchMessage
}