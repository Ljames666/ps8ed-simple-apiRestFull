import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json(), cors(), routes);

app.listen(port, () => console.log('server is running....'));
