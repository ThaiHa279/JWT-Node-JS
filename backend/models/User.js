const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,  
    },
    passWord: {
       type: String,
       required: true, 
       minlength: 1,
    }, 
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,  
    },
    admin: {
        type: Boolean, 
        default: false, 
    },
}, {timestamps: true}
); 

module.exports = mongoose.model('User', userSchema);