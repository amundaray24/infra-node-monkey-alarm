import { initLcdService } from "./services/alarm_service.js";
import initServer from "./middleware/alarm_middleware.js";


process.on('SIGINT',() => {
  console.clear();
  console.log('Received SIGINT - Exiting OK');
  process.exit();
})

const init = async () => {
  initLcdService();
  initServer();
}

await init();