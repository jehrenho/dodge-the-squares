import { Server } from './server.js';
import { CONFIG } from './config.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = new Server(PORT, CONFIG.PUBLIC_DIR);
server.start();