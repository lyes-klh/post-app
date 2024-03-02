import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

app.listen(5000, () => {
  console.log('listening on port 5000');
});
