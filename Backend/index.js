import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";

import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import applicationRoutes from './routes/application.routes.js';
import clientRoutes from "./routes/client.routes.js";
import freelancerRoutes from "./routes/freelancer.routes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app  = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected')).catch(err => console.log("Error connecting to MongoDB:", err.message));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/freelancer", freelancerRoutes);
app.use("/api/client", clientRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});