import express, { Request, Response } from 'express'; 
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'La api esta corriendo'});
});

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); 
        console.log('Conectado a la base de datos');
        
        app.listen(PORT, () => {
                console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    }catch (error) {
        console.error('Error al conectar con el servidor');
        process.exit(1);
    }
}

startServer();