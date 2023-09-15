import User from '../models/user';
import bycrypt from 'bcrypt';
import passport from 'passport';

const saltRounds = 10

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body
        User.findOne({ email })
            .then(async (user) => {
                if (!user) {
                    res.status(404).json({ error: 'User does not exist' });
                    return Promise.reject('User not found'); 
                }
                const isCorrect = await bycrypt.compare(password, user.password);
                if (!isCorrect) {
                    res.status(401).json({ error: 'Incorrect Password' });
                    return;
                }
                req.login(user._id, (err) => {
                    if (err) {
                        console.error('Error logging in:', err);
                        res.status(500).json({ error: 'Internal server error' });
                        return;
                    }
                    res.status(200).json({ message: 'Logged In successfully' })
                })
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
            const { email, password, firstname, lastname, state, country } = req.body;
            User.findOne({ email })
                .then(async (user) => {
                    console.log(user)
                    if (user) {
                        res.status(409).json({ message: 'User already exists' })
                        return Promise.reject('User already exists')
                    }

                    return await bycrypt.hash(password, saltRounds);
                })
                .then((hashedPassword) => {
                    const userObj = {
                        email: email,
                        password: hashedPassword,
                        firstName: firstname,
                        lastName: lastname,
                        'location.state': state,
                        'location.country': country
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

passport.serializeUser((user_id, done) => {
    done(null, user_id);
})

passport.deserializeUser((user_id, done) => {
    User.findById(user_id)
        .then((user) => {
            done(null, user);
        })
        .catch((error) => {
            done(error, null);
        })
})

export default AuthController;
