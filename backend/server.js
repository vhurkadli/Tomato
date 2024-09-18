import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import http from 'http';
import { Server } from 'socket.io';

// app config
const app = express();
const port = 4000;
const server = http.createServer(app); // Create server for Socket.IO

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',  
  }
});

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoint
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Default API response
app.get('/', (req, res) => {
  res.send('API Working');
});

// Listen for socket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export the io instance to use in controllers
export { io };

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
