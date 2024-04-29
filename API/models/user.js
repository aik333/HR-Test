const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
});

// Method to set salt and hash the password for a user
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
};

// Method to verify password
UserSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.passwordHash === hash;
};

module.exports = mongoose.model('User', UserSchema);  