const User = require('../models/userProfile');
const env = process.env.NODE_ENV || "development";
const Verify = require('../models/verify');
const jwt = require('jsonwebtoken');
const config = require('../config/config')[env];
const mailer = require('nodemailer');
const crypto = require('crypto');
const validators = require('./validators/validators');
const validatorUtils = require('./validators/validatorUtils')
const { body } = require('express-validator/check');

module.exports = (router => {
    router.post('/signup',
    [
        body('email')
        .isEmail(),
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
        body('password')
        .custom(password => {
            if(password == null){
                throw new Error('Must provide password');
            }else{
                if(validators.passwordValidator(password)){
                    return true;
                }else{
                    throw new Error('Password must be at least length of 8 and contain at least one uppercase letter');
                }
            }
        })
    ], validatorUtils.checkValidatorErrors,
    (req,res)=>{
        let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password,
            active: false
        });
        
        let verify = new Verify({
            hash: crypto.randomBytes(20).toString('hex'),
            id: user._id
        });
        verify.save((err) =>{
            if(err) return err;
        })
        
        user.save((err)=>{
            if(err){
                if(err.code === 11000){
                    res.json({success: false, message: 'Username or Email already exists!'});
                }else{
                    if(err.errors){
                        if(err.errors.email){
                            res.json({success: false, message: err.errors.email.message});
                        }else{
                            if(err.errors.username){
                                res.json({success: false, message: err.errors.username.message});
                            }else{
                                if(err.errors.password){
                                    res.json({success: false, message: err.errors.password.message});
                                }
                            }
                        }
                    }else{
                        res.json({success: false, message: 'can not save user!'});
                    }
                }
            }
            
            //verify email
            const gmailTrans = mailer.createTransport({
                service:  'Gmail',
                auth:  {
                    user: 'happierdaywu26@gmail.com',
                    pass: 'wu134679'
                }
            })
            const link = config.link + verify.hash;
            const mailOptions  = {
                from:'happierday',
                to: user.email,
                subject: 'Please comfirm you Email for Happierday',
                html : 'Hello,'+user.username+'<br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>'
            };
            gmailTrans.sendMail(mailOptions,function(err,response) {
                if(err){
                    res.json({success:false,message:'Please provide a real email!'})
                }else{
                    res.json({success:true,message:'Please verify your email by clicking the link in your email inbox!',hash:verify.hash})
                }
                return;
            })
        })
    })
})
