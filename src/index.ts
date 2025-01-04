import { dataSource } from './database/dataSource';
import { httpServer } from './httpServer';
import { startServer } from './startServer';


startServer(dataSource, httpServer).then(() => {
  console.log('Server started');
});
