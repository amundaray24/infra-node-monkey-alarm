import express from "express";
import morgan from "morgan";

import router from "../routes/alarm_routes.js";

const initServer = () => {
  const middleware = express();

  //Configuraciones
  middleware.set('port', 3000);
  middleware.set('json spaces', 2);
  
  middleware.disable('x-powered-by');
  
  //Middleware
  middleware.use(morgan('dev'));
  middleware.use(express.urlencoded({extended:false}));
  middleware.use(express.json());
  middleware.use(router);
  
  
  //Iniciando el servidor
  middleware.listen(middleware.get('port'),()=>{
    console.log(`Server listening on port ${middleware.get('port')}`);
  }); 
}

export default initServer;