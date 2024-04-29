const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/UserAuth')
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: Number
});

module.exports = mongoose.model('User', userSchema);
