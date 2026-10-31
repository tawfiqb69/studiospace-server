import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/db.js';
import studioRoutes from './middleware/routes/studios.js';
import cookieParser from 'cookie-parser';
import verifyJWT from './middleware/verifyJWT.js';




const app = express();
const PORT = 8000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
studioRoutes(app);

// TEMPORARY: JWT test korar jonno, pore delete korbo
app.get('/api/me', verifyJWT, (req, res) => {
  res.send(req.user);
});

await connectToMongoDB();

app.get('/', (req, res) => {
  res.send({ message: 'Server is running fine!' });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app;