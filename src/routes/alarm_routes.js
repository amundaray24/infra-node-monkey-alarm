import { Router } from "express";
import { armAlarm, disarmAlarm } from "../services/alarm_service.js";


const router = Router();

router.post('/automation/v0/alarm/arm',(request,response) => {
  armAlarm(request.body)
    .then((body) => {
      response.json(body);
    });
});

router.post('/automation/v0/alarm/disarm',(request,response) => {
  disarmAlarm(request.body)
    .then((body) => {
      response.json(body);
    });
});

export default router;