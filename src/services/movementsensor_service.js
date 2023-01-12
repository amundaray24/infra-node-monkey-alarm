import events from "events";

import { movementSensor } from "../configurations/gpio_inputs_configuration.js";

//INPUTS EVENTS
const movementSensorEvent = new events.EventEmitter();

movementSensor.on('alert', (level) => {
  movementSensorEvent.emit('movement-sensor-dispatch',{level});
});

export default movementSensorEvent;