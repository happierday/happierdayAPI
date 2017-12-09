const User = require('../models/userProfile');
const env = process.env.NODE_ENV || "development";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];
const validators = require('./validators/validators');
const validatorUtils = require('./validators/validatorUtils')
const { body } = require('express-validator/check');
//check password
function validatePassword (password,dbPassword){
    return bcrypt.compareSync(password,dbPassword);
}

module.exports = (router => {
    router.post('/login',
    [
        body('password')
        .isLength({min:8}),
        body('username')
        .custom(username => {
            if(username == null){
                throw new Error('Must provide username');
            }else{
                if(validators.usernameValidator(username)){
                    return true;
                }else{
                    throw new Error('Username must be in between 5 and 20 characters long!');
                }
            }
        })
    ], validatorUtils.checkValidatorErrors,
    (req,res)=>{
        User.findOne({username: req.body.username.toLowerCase()},(err, user) => {
            if(err){
                res.json({success: false, message: err});
            }else{
                if(user){
                    if(user.active){
                        if(validatePassword(req.body.password,user.password)){
                            const token = jwt.sign({userId: user._id},'secret',{ expiresIn: '10h' });
                            res.json({success: true, message: 'Loged In',token:token});
                        }else{
                            res.json({success: false, message: 'Password does not match'});
                        }
                    }else{
                        res.json({success: false, message: 'Please verify your account first throught the link in your email inbox!'});
                    }
                }else{
                    res.json({success: false, message: 'No such account!'});
                }
            }
        })
    })
})
