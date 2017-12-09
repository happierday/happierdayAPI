const Joke = require('../models/joke');
const User = require('../models/userProfile');
const auth = require('../services/authentication');
const validators = require('./validators/validators');
const validatorUtils = require('./validators/validatorUtils')
const { body } = require('express-validator/check');

module.exports = (router =>{
    
    router.post('/newposts', auth,
    [
        body('title')
        .custom(title => {
            if(title == null){
                throw new Error('Must provide title');
            }else{
                if(validators.titleValidator(title)){
                    return true;
                }else{
                    throw new Error('Title must be between length of 5 and 50!');
                }
            }
        }),
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
        }),
        body('content')
        .custom(content => {
            if(content == null){
                throw new Error('Must provide content');
            }else{
                if(validators.contentValidator(content)){
                    return true;
                }else{
                    throw new Error('content must be in between 50 and 5000 characters long!');
                }
            }
        })
    ], validatorUtils.checkValidatorErrors,
    (req,res)=>{
        User.findById(req.decoded.userId,(err,user) =>{
            if(err){
                res.json({success: false, message: err});
            }else{
                if(user){
                    if(user.username === req.body.username){
                        let date = new Date();
                        const joke = new Joke({
                            username: req.body.username,
                            title: req.body.title,
                            ref: req.body.title.replace(/[\W_]+/g,"-"),
                            content: req.body.content,
                            category: 'jokes',
                            createdAt: new Date()
                        })
                        joke.save((err) =>{
                            if(err){
                                res.json({success:false, message: err});
                            }else{
                                res.json({success:true, message: 'Posted'});
                            }
                        })
                    }else{
                        res.json({success: false, message: 'User account does not match!'});
                    }
                }else{
                    res.json({success: false, message: 'Please Log In as a valid user!'});
                }
            }
        })
    })
})