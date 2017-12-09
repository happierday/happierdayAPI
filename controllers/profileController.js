const auth = require('../services/authentication');
const User = require('../models/userProfile');

module.exports = (router => {
    router.get('/profiles/:username',auth, (req,res) => {
        User.findOne({username:req.params.username},(err,user) =>{
            if(err){
                res.json({success: false, message: err});
            }else{
                if(user){
                    if(req.decoded){
                        if(user._id === req.decoded.userId){
                            res.json({username:user.username,email:user.email,auth:true});
                        }else{
                            res.json({username:user.username,email:user.email,auth:false});
                        }
                    }else{
                        res.json({username:user.username,email:user.email,auth:false});
                    }
                }else{
                    res.json({success: false, message: 'User not found!'});
                }
            }
        })
    })
})
