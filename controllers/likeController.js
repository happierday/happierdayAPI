const Joke = require('../models/joke');
const User = require('../models/userProfile');
const auth = require('../services/authentication');
const validators = require('./validators/validators');
const validatorUtils = require('./validators/validatorUtils')
const { param } = require('express-validator/check');

let refUser;
function containUser(user){
    return user.username === refUser;
}

module.exports = (router => {
    router.get('/like/:title/:username', auth,
    [
        param('title')
        .custom(title => {
            if(title == null){
                throw new Error('Must provide title');
            }else{
                if(validators.titleValidator(title)){
                    return true;
                }else{
                    throw new Error('Title must be in between 5 and 50 characters long!');
                }
            }
        }),
        param('username')
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
    (req,res) => {
        refUser = req.params.username;
        User.findById(req.decoded.userId,(err, user) => {
            if(err){
                res.json({success: false, message: err });
            }else{
                if(user){
                    if(user.username !== req.params.username){
                        res.json({success: false, message: 'Please use correct account!'});
                    }else{
                        Joke.findOne({ref: req.params.title}, (err, joke) => {
                            if(err){
                                res.json({success: false, message: err });
                            }else{
                                if(joke){
                                    let likedUser = joke.likes.find(containUser);
                                    let dislikedUser = joke.dislikes.find(containUser);
                                    if(likedUser){
                                        let index = joke.likes.indexOf(likedUser);
                                        joke.likes.splice(index,1);
                                    }else{
                                        if(dislikedUser){
                                            let index = joke.dislikes.indexOf(dislikedUser);
                                            joke.dislikes.splice(index,1);
                                        }
                                        joke.likes.push({
                                            userId: user._id,
                                            username: user.username
                                        });     
                                    }
                                    joke.save((err) => {
                                        if(err){
                                            res.json({success: false, message: err });
                                        }
                                        res.send(joke);
                                    })
                                }else{
                                    res.json({success: false, message: "Joke not found!" });
                                }
                            }
                        })
                    }
                }else{
                    res.json({success: false, message: "User not found!" });
                }
            }
        })
    })
})