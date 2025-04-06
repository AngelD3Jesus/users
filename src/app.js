//Configuración de express
import bodyParser from "body-parser";
import express from "express";
import usersRoutes from "./routes/usersRoutes.js";
import swaggerSpec from "./api-docs.js"
import swaggerUI from "swagger-ui-express"
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(bodyParser.json());
app.use("/app/users", usersRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
export default app;
