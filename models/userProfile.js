const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/*validator user schema
**validate user input before saving to database
*/

//email validator
let  emailLengthChecker = (email) => {
    if(!email){
        return false;
    }else{
        if(email.length < 10 || email.length > 50){
            return false;
        }else{
            return true;
        }
    }
}
let validEmailCheker = (email)  =>  {
    if(!email){
        return false;
    }else{
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
}
let emailValidator = [
    {
        validator: emailLengthChecker,
        message: 'Email must be at least 10 characters long but no longer than 50!'
    },
    {
        validator: validEmailCheker,
        message: 'You must enter a valid email!'
    }
]

//username validator
let  usernameLengthChecker = (username) => {
    if(!username){
        return false;
    }else{
        if(username.length < 5 || username.length > 20){
            return false;
        }else{
            return true;
        }
    }
}
let validUsernameChecker = (username) =>  {
    if(!username){
        return false;
    }else{
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
}
let usernameValidator = [
    {
        validator: usernameLengthChecker,
        message: 'username must be at least 5 characters long but no longer than 20!'
    },
    {
        validator: validUsernameChecker,
        message: 'Username should only contain lower,upper case and number!'
    }
]

//password validator
let  passwordLengthChecker = (password) => {
    if(!password){
        return false;
    }else{
        if(password.length < 8){
            return false;
        }else{
            return true;
        }
    }
}
let validPasswordChecker = (password) =>  {
    if(!password){
        return false;
    }else{
        const regExp = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]+$/);
        return regExp.test(password);
    }
}
let passwordValidator = [
    {
        validator: passwordLengthChecker,
        message: 'password must be at least 8 characters long!'
    },
    {
        validator: validPasswordChecker,
        message: 'password should contain at least one lower,upper case and number!'
    }
]

//create user schema
const userProfileSchema = new Schema({
    email:  { type : String, required:true,  unique:true, lowercase:true, validate: emailValidator},
    username:  { type : String, required:true,  unique:true, lowercase:true, validate: usernameValidator},
    password:  { type : String, required:true,  validate: passwordValidator},
    active: { type: Boolean }
});

//before save to mongodb, check whether password is hashed or not
userProfileSchema.pre('save',function(next){
    if(!this.isModified('password')) return next();
    bcrypt.hash(this.password,10,(err,hash)=>{
        if(err) return next(err);
        this.password = hash;
        next();
    })
})

//export model
module.exports = mongoose.model('users', userProfileSchema);
