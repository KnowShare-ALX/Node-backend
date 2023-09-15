import User from '../models/user';
import bycrypt from 'bcrypt';

class AuthController {
    static async login(req, res) {
        
    }

    static async signup(req, res) {
        try {
            const { email, password, firstname, lastname, state, country, city } = req.body;
            User.findOne({ email })
                .then((user) => {
                    console.log(user)
                    if (user) {
                        res.status(409).json({ message: 'User already exists' })
                        return Promise.reject('User already exists')
                    }

                    return bycrypt.hash(password, 10);
                })
                .then((hashedPassword) => {
                    const userObj = {
                        email: email,
                        password: hashedPassword,
                        firstName: firstname,
                        lastName: lastname,
                        location: {
                            country,
                            state,
                            city
                        }
                        
                    }

                    const newUser = new User(userObj);
                    return newUser.save()
                })
                .then((insertedUser) => {
                    res.status(201).json({
                        userId: insertedUser._id,
                        email: insertedUser.email,
                        firstName: insertedUser.firstName,
                        lastName: insertedUser.lastName,
                        joinedDate: insertedUser.joinedDate
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
}

export default AuthController;
