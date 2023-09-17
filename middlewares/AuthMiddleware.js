import passport from 'passport';
import redisClient from '../utils/redis';

const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }
      
      console.log(user)
      const token = req.headers.authorization.split(' ')[1]
      if (redisClient.isAlive()) {
        const user_id = redisClient.get(`auth_${token}`);
        user_id.then((value) => {
            console.log('value is', value)
            if (!value) {
                console.log('In here')
                return res.status(401).json({ error: 'Authentication failed token invalid' })
            }
            // If authentication is successful, set the user on the request object
            req.user = user;
        
            // Continue to the next middleware or route handler
            next();
        }).catch((error) => {
            console.log(error)
            return res.status(500).json({ error: 'something went wrong' });
        })
      }else {
        return res.status(500).json({ error: 'Redis is not available' });
      }
    })(req, res);
  };

export default authenticateJWT;
