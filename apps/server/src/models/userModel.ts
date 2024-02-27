import mongoose, { Document, Model } from 'mongoose';

// export type TUser = {
//   username: string;
//   email: string;
//   password: string;
// };
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
