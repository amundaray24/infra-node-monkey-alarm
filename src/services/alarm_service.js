import movementSensorEvent from "./movementsensor_service.js";

import { 
  initLcd,
  displayArmAlarmMessage,
  displayDisarmAlarmMessage,
  displayAlarmDispatchMessage
} from "./lcd_service.js";

import { 
  buzzerArmAlarmSound,
  buzzerDisarmAlarmSound,
  buzzerAlarmDispatched
} from "./buzzer_service.js";


let dispatched = false;
let armed = false;
let silenced = false;

const initLcdService = () => {
  initLcd();
}

const armAlarm = async (request) => {
  silenced = request.silenced;
  return new Promise(async(resolve) => {
    displayArmAlarmMessage()
      .then(() => {
        armed = true;
        if (request.alert) buzzerArmAlarmSound();
      });
    resolve(
      {
        date: new Date(),
        message: 'Alarm Armed!'
      }
    );
  });
}

const disarmAlarm = async (request) => {
  armed = false;
  dispatched = false;
  return new Promise(async(resolve) => {
    displayDisarmAlarmMessage()
      .then(() => {
        if (request.alert) buzzerDisarmAlarmSound();
      });
    resolve(
      {
        date: new Date(),
        message: 'Alarm Disarmed!'
      }
    );
  });
}



movementSensorEvent.on('movement-sensor-dispatch',() => {
  if (!dispatched && armed) {
    dispatched = true;
    dispatchAlarm();
  }
});

const dispatchAlarm = async () => {
  let dispatch = true;
  do {    
    if (dispatch && dispatched) {
      dispatch = false;
      if (!silenced) buzzerAlarmDispatched();
      await displayAlarmDispatchMessage()
        .then(() => {
          dispatch = true;
        }); 
    }
  } while (dispatched === true);
}

export {
  initLcdService,
  armAlarm,
  disarmAlarm
}