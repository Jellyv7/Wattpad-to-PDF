import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { router as storyRouter } from './routes/storyRouter';

const app = express();

//Settings
const { PORT = 8080 } = process.env;

//Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//Routes
app.use('/api', storyRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/dist'));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
	})
};

//Starting Server
app.listen(PORT, () => {
	console.log(`Server at port ${PORT}`);
});

