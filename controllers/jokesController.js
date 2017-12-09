const Joke = require('../models/joke');
const Comment = require('../models/comment');
const User = require('../models/userProfile');
const auth = require('../services/authentication');
const validators = require('./validators/validators');
const validatorUtils = require('./validators/validatorUtils')
const { param, body } = require('express-validator/check');

module.exports = (router => {
    router.get('/jokes/:ref', auth,
    [
        param('ref','Must provide url title')
        .exists(),
    ], validatorUtils.checkValidatorErrors,
    (req,res) => {
        Joke.findOne({ref:req.params.ref}, (err, joke) => {
            if(err){
                res.json({success: false, message: err});
            }else{
                if(joke){
                    if(req.decoded){
                        User.findById(req.decoded.userId, (err,user) =>{
                            if(err){
                                res.json({success: false, message: err});
                            }else{
                                if(user){
                                    if(joke.username === user.username){
                                        res.json({joke:joke,auth:true});
                                    }else{
                                        res.json({joke:joke,auth:false});
                                    }
                                }else{
                                    res.json({joke:joke,auth:false});
                                }
                            }
                        })
                    }else{
                        res.json({joke:joke,auth:false});
                    }
                }else{
                    res.json({success: false, message: 'Oops, Not Found!'});
                }
            }
        })
    })
    
    router.get('/jokes/comments/:ref',
    [
        param('ref','Must provide url title')
        .exists(),
    ], validatorUtils.checkValidatorErrors,
    (req,res) => {
        Comment.findOne({ref: req.params.ref}, (err,comments) =>{
            if(err){
                res.json({success: false, message: err});
            }else{
                if(comments){
                    res.send(comments);
                }else{
                    res.json({success:false, message: "Be the first one to comment on this joke!"})
                }
            }
        })
    })
    
    router.delete('/jokes/delete/:ref', auth,
    [
        param('ref','Must provide url title')
        .exists(),
    ], validatorUtils.checkValidatorErrors,
    (req,res) =>{
        Joke.findOne({ref: req.params.ref}).remove().exec();
        res.json({success:true, message: 'Joke Removed'});
    })

    router.put('/jokes/edit/:ref',
    [
        param('ref','Must provide url title')
        .exists(),
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
    (req,res) =>{
        Joke.findOne({ref: req.params.ref},(err,joke) =>{
            if(err){
                res.json({success: false, message: err});
            }else{
                if(joke){
                    if(req.body.title){
                        joke.title = req.body.title;
                        joke.ref = req.body.title.replace(/[\W_]+/g,"-");
                    }
                    if(req.body.content){
                        joke.content = req.body.content;
                    }
                    joke.editedAt = new Date();
                    joke.save((err) =>{
                        if(err){
                            res.json({success:false, message: err});
                        }else{
                            res.json({success:true, message: 'Edit Successful!',joke:joke});
                        }
                    })
                }else{
                    res.json({success: false, message: 'No joke is found!'})
                }
            }
        })
    })
    
    router.post('/jokes/:ref', 
    [
        param('ref','Must provide url title')
        .exists(),
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
        body('comment')
        .custom(comment => {
            if(comment == null){
                throw new Error('Must provide username');
            }else{
                if(validators.commentValidator(comment)){
                    return true;
                }else{
                    throw new Error('Comment must be in between 5 and 1000 characters long!');
                }
            }
        })
    ], validatorUtils.checkValidatorErrors,
    (req,res) =>{
        Comment.findOne({ref: req.params.ref}, (err,comments) =>{
            if(err){
                res.json({success: false, message: err});
            }else{
                if(comments){
                    comments.comments.unshift({
                        username: req.body.username,
                        comment: req.body.comment
                    })
                    comments.save((err) => {
                        if(err){
                            res.json({success: false, message: err});
                        }
                        res.send(comments);
                    })
                }else{
                    const comment = new Comment({
                        ref: req.params.ref,
                        comments:[{
                            username: req.body.username,
                            comment: req.body.comment
                        }]
                    })
                    comment.save((err) => {
                        if(err){
                            res.json({success: false, message: err});
                        }
                        res.send(comment);
                    })
                }
            }
        })
    })
})
