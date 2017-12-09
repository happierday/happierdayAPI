const Joke = require('../models/joke');

module.exports = (router => {
    router.get('/home',(req,res) => {
        Joke.find({},(err,jokes) => {
            if(err){
                res.json({success: false, message: err})
            }else{
                if(jokes){
                    res.send(jokes);
                }else{
                    res.json({success: false, message: 'No jokes found!'});
                }
            }
        }).sort({_id:-1})
    })
});