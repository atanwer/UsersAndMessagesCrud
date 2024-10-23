import express from "express";
import connectDB from "./config/database.js";
import userRoutes from './routes/userRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

const app = express();

// middleware
app.use(express.json());

const port = process.env.PORT || 3000;


// Database connection 
connectDB();

app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})