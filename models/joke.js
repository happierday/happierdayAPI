const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

//content validator
let  contentLengthChecker = (content) => {
    if(!content){
        return false;
    }else{
        if(content.length < 50 || content.length > 5000){
            return false;
        }else{
            return true;
        }
    }
}

let contentValidator = [
    {
        validator: contentLengthChecker,
        message: 'Content must be at least 50 characters long, but no longer than 5000!'
    }
]

//title validator
let  titleLengthChecker = (title) => {
    if(!title){
        return false;
    }else{
        if(title.length < 5 || title.length > 50){
            return false;
        }else{
            return true;
        }
    }
}

let titleValidator = [
    {
        validator: titleLengthChecker,
        message: 'Title must be at least 5 characters long, but no longer than 50!'
    }
]

//create user schema
const jokeSchema = new Schema({
    username:  { type : String, required:true, lowercase:true },
    title: { type: String, required: true, validate: titleValidator, unique:true },
    content: { type: String, required: true, validate: contentValidator },
    ref: { type: String, required:true, unique:true },
    category: { type: String, required: true },
    likes:[{
        userId: String,
        username: String
    }],
    dislikes: [{
        userId: String,
        username: String   
    }],
    createdAt: { type: Date, required: true },
    editedAt: { type: Date }
});


//export model
module.exports = mongoose.model('jokes', jokeSchema);
