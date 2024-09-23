import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import websiteRoutes from './routes/website.route.js';
import { checkWebsiteStatus } from './controllers/website.controller.js';
import cron from 'node-cron';

dotenv.config();

mongoose.connect(process.env.MONGO).then( () => {
    console.log("Connect to MongoDB");
}).catch( (err) => {
    console.log(err);
});

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000!!');
});

// Use the routes
app.use('/api/websites', websiteRoutes);

// Schedule website status checks every 30 minutes
cron.schedule('*/30 * * * *', () => {
    checkWebsiteStatus();
});