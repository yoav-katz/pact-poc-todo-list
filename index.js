import cors from 'cors';
import express from 'express';
import { connect } from 'mongoose';
import tasksRouter from './routes/tasks';

const PORT = 3000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/tasks'

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connect(MONGODB_URI).then(() => { 
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
 }).catch(err => console.error("❌ MongoDB connection error:", err));

app.use("/task", tasksRouter);