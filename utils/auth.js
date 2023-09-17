require('dotenv').config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const JwtStrategy = passport.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const JwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrket: process.env.TOKEN_SECRET,
};

const strategy = new JwtStrategy(JwtOptions, (payload, done) => {
    // Check if the user exists in your database (payload.sub should contain the user ID)
    const user = getUserById(payload.sub);
  
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
  
passport.use(strategy);

export default class AuthHandler {
    static generateAcessToken(userDetails) { //userDetails should be an object {email}
        return jwt.sign(
            userDetails,
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );
    }
}