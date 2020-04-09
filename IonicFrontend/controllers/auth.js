const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.signup = (req, res, next) => {

    if(!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'you need to send email and password'})
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    User.findOne({ email: email })
    .then(user => {
        if(user) {
            const error = new Error('User with this mail already exist');
                //user not found
            error.statusCode = 404;
            throw error;
        }
       let newUser = User(req.body);
       return newUser.save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'A new user is created!',
            user: result
        });
    })
    .catch(err => {
        if(!err.statusCode) {
            //its a server side error
            err.statusCode = 500;
        }
        //move to the error in de middleware (aka app.js)
        next(err);
    });
};

exports.logout = (req, res, next) => 
  verify(req.body.token)
    .then(decoded =>
      decoded.exp - parseInt(new Date().getTime() / 1000))
    .then(expiration => redis.set(req.body.token, true, 'EX', expiration));

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let fetchedUser;
    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            const error = new Error('there is no user with this email');
            //user not found
            error.statusCode = 404;
            throw error
        }
        fetchedUser = user;
        return bcrypt.compare(password, user.password);
    })
    .then(passwordIsEqual => {
        if(!passwordIsEqual) {
            const error = new Error('Wrong password for this user');
            //user not found
            error.statusCode = 404;
            throw error;
        }
        //create jsonwebtoken to let server know that he/she is logged in, will log out after 1 hour
        const jsonWebToken = jwt.sign(
            {
                email: fetchedUser.email, 
                userId: fetchedUser._id.toString()
            }, 
            config.jwtSecret, 
            { expiresIn: '1h' }
        );
        res.status(200).json({ token: jsonWebToken, userId: fetchedUser._id.toString() })
        //generatedtokens contain the userdata, if it gets edited, the token itself will change in value, making it invalid
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};