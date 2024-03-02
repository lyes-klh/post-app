import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';
import { User } from '@post-app/database';

passport.use(
  'custom',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, cb) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          return cb({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
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
  cb(null, (user as User).id);
});

passport.deserializeUser(async function (id: string, cb) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return cb({ message: `Deserialize user failed: user does not exist` });
    }
    return cb(null, user);
  } catch (err) {
    return cb({ message: `Deserialize user failed: user does not exist` });
  }
});

export { passport };
