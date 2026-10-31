import express from 'express';
import { connectToMongoDB } from './config/db.js';

const app = express();
const PORT = 8000;

connectToMongoDB();

app.get('/', (req, res) => {
  res.send({ message: 'Server is running fine!' });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});