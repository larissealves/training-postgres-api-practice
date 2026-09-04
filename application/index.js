import express from 'express';
import cors from 'cors';

import dishRoutes from "./routes/dish.js";
import tagRoutes from "./routes/tag.js";
import ingredientsRoutes from "./routes/ingredients.js";
import categoriesRoutes from './routes/categories.js'

import loginRoutes from './routes/login/login.js'

const port = 3000;
const hostname = "0.0.0.0";

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', dishRoutes);
app.use('/api', tagRoutes);
app.use('/api', ingredientsRoutes);
app.use('/api', categoriesRoutes);

app.use('/api', loginRoutes);



app.listen(port, hostname, () => {
    console.log(`Example app listening on port http://${hostname}:${port}/`);
});