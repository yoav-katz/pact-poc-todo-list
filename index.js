import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connect } from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import tasksRouter from './routes/tasks.js';
import swaggerDoc from './swagger-doc.json' with { type: "json" };

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tasks';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("/task", tasksRouter);

// Connect to MongoDB
connect(MONGODB_URI).then(() => { 
  console.log("✅ Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
 }).catch(err => console.error("❌ MongoDB connection error:", err));