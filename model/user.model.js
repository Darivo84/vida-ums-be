const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email: { 
        type: String 
    },
    password: { 
        type: String 
    },
    resetToken: String,
    expireToken: Date,
});

userSchema.statics.findUser = async function(email, password) {
    const user = await User.findOne({ email });
    // console.log(user, '==');
    if (!user) {
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    if (!isMatch) {
        return;
    }
    return user;
};

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

const User = mongoose.model("UserModel", userSchema);

module.exports = User;