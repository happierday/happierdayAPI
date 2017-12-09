function titleValidator(title){
    return ((title.length < 5 || title.length > 50)? false: true);
}

function usernameValidator(username){
    return ((username.length < 5 || username.length > 20)? false: true);
}

function commentValidator(comment){
    return ((comment.length < 5 || comment.length > 1000)? false: true);
}

function passwordValidator(password){
    let regExp = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]+$/);
    if(regExp.test(email)){
        return ((password.length < 8)? false: true);
    }else{
        return false;
    }
}

function contentValidator(content){
    return ((content.length < 50 || content.length > 5000)? false: true);
}

module.exports = {
    titleValidator: titleValidator,
    usernameValidator: usernameValidator,
    commentValidator: commentValidator,
    passwordValidator: passwordValidator,
    contentValidator: contentValidator
};