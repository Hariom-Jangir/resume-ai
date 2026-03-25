const mongoose = require('mongoose');

const blacklistSTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required for blacklisting']
    }
}, {
    timestamps: true
});

const tokenBlacklistModel = mongoose.model('blacklistToken', blacklistSTokenSchema);

module.exports = tokenBlacklistModel;
