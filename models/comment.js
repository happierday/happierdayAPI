const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

//comment validator
let  commentLengthChecker = (comment) => {
    if(!comment){
        return false;
    }else{
        if(comment.length < 5 || comment.length > 1000){
            return false;
        }else{
            return true;
        }
    }
}

let commentValidator = [
    {
        validator: commentLengthChecker,
        message: 'Content must be at least 5 characters long, but no longer than 1000!'
    }
]

//create user schema
const commentSchema = new Schema({
    ref: { type: String, required: true, unique:true },
    comments: [{
        username:  { type : String, required:true, lowercase:true },
        comment: { type: String, required: true, validate: commentValidator },
    }]
});


//export model
module.exports = mongoose.model('comments', commentSchema);
