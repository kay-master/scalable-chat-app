import http from 'http';
import app from './app';
import socketServer from './websocket/websocket';
import { chatMessageConsumer, eventConsumer } from './services/kafka-consumer';
import { redisConnect } from './services/redis.service';

// Creating http server
const httpServer = http.createServer(app);

const io = socketServer(httpServer);

console.log(new Date().getTime());

redisConnect();

// Consume from specific topic
chatMessageConsumer(io);
eventConsumer(io);

const server = httpServer.listen(app.get('port'), () => {
	console.log(
		'App is running at http://localhost:%d in %s mode',
		app.get('port'),
		app.get('env')
	);
	console.log('Press CTRL-C to stop\n');
});

export default server;
