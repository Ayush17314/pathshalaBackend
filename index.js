import { app } from "./src/server.js";
import { connectDB } from "./src/config/db.js";
import cors from 'cors';

// app.use(cors({
//   origin: 'http://localhost:3000',  // your frontend URL
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

import dotenv from "dotenv";


dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });