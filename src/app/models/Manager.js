const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
    name: {type: String},
    birth: {type: String},
    phone: {type: String},
    email: {type: String},
    account: {
        username: {type: String, unique: true, required: true},
        password: {type: String, required: true}
    }
}, {
    timestamps: true,
});

//ADD PLUGIN

module.exports = mongoose.model('Manager', ManagerSchema);