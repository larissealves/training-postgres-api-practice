import express from 'express';
import session from 'express-session';

import client from './redis.js';
import { RedisStore } from 'connect-redis';

import cors from 'cors';

import dishRoutes from "./routes/dish.js";
import tagRoutes from "./routes/tag.js";
import ingredientsRoutes from "./routes/ingredients.js";
import categoriesRoutes from './routes/categories.js'

import loginRoutes from './routes/login/login.js'

const port = 3000;
const hostname = "localhost";

const app = express();

app.use(express.json());

const allowedOrigins = 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(session({
    store: new RedisStore({
        client: client
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        priority: 'medium',
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
})); 

app.use('/api', dishRoutes);
app.use('/api', tagRoutes);
app.use('/api', ingredientsRoutes);
app.use('/api', categoriesRoutes);

app.use('/api', loginRoutes);

app.get('/api/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            user: '',
            message: 'Não autenticado'
        });
    }

    res.json({
        user: req.session.user,
        message: '',
    });
});


app.listen(port, hostname, () => {
    console.log(`Example app listening on port http://${hostname}:${port}/`);
});