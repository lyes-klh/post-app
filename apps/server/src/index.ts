import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const MONGO_URL = process.env.DB_URL as string;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('DB connected successfully'))
  .catch(() => console.log('DB connection failed'));

mongoose.connection.on('error', (error) => console.log('DB error : ', error));

app.listen(5000, () => {
  console.log('listening on port 5000');
});
