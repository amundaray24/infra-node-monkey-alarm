import movementSensorEvent from "./movementsensor_service.js";

import { 
  initLcd,
  displayArmAlarmMessage,
  displayDisarmAlarmMessage,
  displayAlarmDispatchMessage,
  displayInvalidPasswordMessage
} from "./lcd_service.js";

import { 
  buzzerArmAlarmSound,
  buzzerDisarmAlarmSound,
  buzzerAlarmDispatched
} from "./buzzer_service.js";


let dispatched = false;
let armed = false;
let silenced = false;
let tries = 5;

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
  return new Promise(async(resolve,reject) => {
    if (request.password === '221115' && armed) {
      armed = false;
      dispatched = false;
      tries = 5;
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
    } else if (!dispatched && !armed) {
      resolve(
        {
          date: new Date(),
          message: 'Alarm is already disarmed!'
        }
      );
    } else {
      if (tries === 0) tries = 5;
      displayInvalidPasswordMessage(tries--)
        .then(() => {
          if (request.alert) buzzerDisarmAlarmSound();
        })
      reject(
        {
          date: new Date(),
          message: 'Invalid Password'
        }
      )
    }
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