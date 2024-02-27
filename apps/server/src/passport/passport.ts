import passport from 'passport';
import UserModel, { TUser } from '@/models/userModel';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';

passport.use(
  'custom',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, cb) => {
      try {
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
          // return cb(new InvalidUserError('User not found'));
          return cb({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          // return cb(
          //   new InvalidUserError(`Login failed for user ${user.username}: incorrect password`),
          // );
          return cb({ message: `Login failed for user ${user.email}: incorrect password` });
        }
        return cb(null, user);
      } catch (error) {
        return cb({ message: `Error when tried to log user` });
      }
    },
  ),
);

passport.serializeUser(function (user, cb) {
  cb(null, (user as TUser)._id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      // return cb(new DeserializeUserError(`Deserialize user failed: user does not exist`));
      return cb({ message: `Deserialize user failed: user does not exist` });
    }
    return cb(null, user);
  } catch (err) {
    return cb({ message: `Deserialize user failed: user does not exist` });
  }
});

export { passport };
