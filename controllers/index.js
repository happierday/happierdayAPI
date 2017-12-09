const signupController = require('./signupController');
const loginController = require('./loginController');
const profileController = require('./profileController');
const verifyController = require('./verifyController');
const jokesController = require('./jokesController');
const newPostController = require('./newPostController');
const homeController = require('./homeController');
const likeController = require('./likeController');
const dislikeController = require('./dislikeController');

module.exports = (app => {
    signupController(app),
    loginController(app),
    profileController(app),
    verifyController(app),
    newPostController(app),
    jokesController(app),
    homeController(app),
    likeController(app),
    dislikeController(app)
})