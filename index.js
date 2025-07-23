import cors from 'cors';
import express from 'express';
import { connect } from 'mongoose';
import tasksRouter from './routes/tasks';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connect('mongodb://localhost:15347')
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.use(tasksRouter);

// -------------------- START SERVER --------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
