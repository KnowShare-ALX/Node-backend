import passport from 'passport';
import redisClient from '../utils/redis';
import { Strategy, ExtractJwt } from 'passport-jwt';
const User = require('../models/user');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
};

passport.use(new Strategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);

    if (user) {
      const token = payload.token;
      const result = await redisClient.get(`auth_${token}`);

      if (!result) {
        return done(null, false);
      }

      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));


export default passport;
