import passport from 'passport';
import redisClient from '../utils/redis';
import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
};

passport.use(new Strategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));

const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = req.headers.authorization.split(' ')[1]
    if (redisClient.isAlive()) {
      const user_id = redisClient.get(`auth_${token}`);
      user_id.then((value) => {
          if (!value) {
            return res.status(401).json({ error: 'Session expired' });
          }
          // If authentication is successful, set the user on the request object
          req.user = user;
      
          // Continue to the next middleware or route handler
          next();
      }).catch((error) => {
          console.log(error)
          return res.status(500).json({ error: 'Something went wrong' });
      })
    }else {
      return res.status(500).json({ error: 'Redis is not available' });
    }
  })(req, res);
};

export default authenticateJWT;