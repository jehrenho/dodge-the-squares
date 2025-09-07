import { Server } from './server.js';
import { CONFIG } from './config.js';

const server = new Server(CONFIG.PORT, CONFIG.PUBLIC_DIR);
server.start();