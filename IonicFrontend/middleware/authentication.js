const jsonWebToken = require('jsonwebtoken');

//add in frontend the following: 'Bearer jsonwebtokenvalue'
module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jsonWebToken.verify(token, 'superdupersecret');
    } catch (err) {
        const error = new Error('invalid token, pls login again and use the generated jsonwebtoken');
        error.statusCode = 401;
        throw error;
    }

    if (!decodedToken) {
        const error = new Error('this token can not be authenticated by server');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    console.log('we in business, user is authenticated');
    next();
};