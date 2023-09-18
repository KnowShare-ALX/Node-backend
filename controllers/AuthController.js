require('dotenv').config()
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { redisClient } from '../utils/redis';
import AuthHandler from '../utils/auth';
const bcrypt = require('bcrypt');


const redisDuration = 24 * 60 * 60;


class AuthController {
    static async login(req, res) {
        const { email, password } = req.body
        User.findOne({ email })
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ error: 'User does not exist' });
                    return Promise.reject('User not found');
                }
                const isCorrect = await bcrypt.compare(password, user.password);
                if (!isCorrect) {
                    res.status(401).json({ error: 'Incorrect Password' });
                    return;
                }
                console.log(user);
                const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
                const key = `auth_${token}`;
                await redisClient.set(key, user._id.toString(), redisDuration)
                        .then(() => console.log('Successfully set'))
                        .catch((error) => console.error('Error setting auth token:', error))
                console.log('set key')
                res.status(200).json({ message: 'Logged In successfully', token: token })
            })
            .catch((error) => {
                console.error(error);
                if (error !== 'User not found') {
                    res.status(500).json({ error: 'Internal server error' });
                }
            })
    }

    static async signup(req, res) {
        try {
            const {
                email,
                password,
                firstName,
                lastName,
                state, 
                country, 
                city, 
                gender, 
                dateOfBirth
             } = req.body;
             console.log('this is email = ' + email);
            User.findOne({ email })
                .then(async (user) => {
                    console.log(user)
                    if (user) {
                        res.status(409).json({ message: 'User already exists' })
                        return Promise.reject('User already exists')
                    }

                    // return await bycrypt.hash(password, saltRounds);
                    console.log('this is the password' + password);
                    return await AuthHandler.hashPassword(password);
                      
                })
                .then((hashedPassword) => {
                    const userObj = {
                        email: email,
                        password: hashedPassword,
                        firstName: firstName,
                        lastName: lastName,
                        location: {
                            country,
                            state,
                            city
                        },
                        gender: gender,
                        dateOfBirth: new Date(dateOfBirth)
                    }

                    const newUser = new User(userObj);
                    return newUser.save()
                })
                .then(async (insertedUser) => {
                    const token = jwt.sign(
                        { id: insertedUser._id }, 
                        process.env.TOKEN_SECRET, 
                        { expiresIn: '1d' }
                    );
                    const key = `auth_${token}`;
                    await redisClient.set(key, insertedUser._id, redisDuration)
                        .then(() => console.log('Successfully set'))
                        .catch((error) => console.error('Error setting auth token:', error))
                    res.status(201).json({
                        userId: insertedUser._id,
                        email: insertedUser.email,
                        firstName: insertedUser.firstName,
                        lastName: insertedUser.lastName,
                        joinedDate: insertedUser.joinedDate,
                        token: token
                    });
                })
                .catch((error) => {
                    console.error(error);
                    if (error !== 'User already exists') {
                        res.status(500).json({ error: 'Internal server error' });
                    }
                });
        } catch (e) {
            console.error(e)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    static async logout(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1]
            const deleted = await redisClient.del(`auth_${token}`)
            if (deleted) {
                return res.status(200).json({ message: 'Logged out successfully' })
            } else {
                return res.status(404).json({ error: 'Token not found in Redis' });
            }
        } catch (error) {
            console.error('Error while logging out:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AuthController;
