const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const verifySchema = new Schema({
    hash : { type : String, required:true,  unique:true},
    id : { type : String, required:true,  unique:true}
});

module.exports = mongoose.model('verify', verifySchema);