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

export default class AuthHandler {
    static generateAcessToken(userDetails) { //userDetails should be an object {email}
        return jwt.sign(
            userDetails,
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );
    }
}