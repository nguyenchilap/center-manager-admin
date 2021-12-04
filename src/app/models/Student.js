const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema(
    {
        // _id: {type: Number},
        name: {type: String, maxlength: 50},
        birth: {type: String},
        phone: {type: String, maxlength: 20},
        email: {type: String, maxlength: 50},
        img: {type: String, default: 'none'},
        createAt: {type: Date, default: Date.now},
        account: {
            username: {type: String, required: true, unique: true},
            password: {type: String, required: true},
            createAt: {type: Date, default: Date.now()}
        },
        banned: {
            login: {type: Boolean},
            comment: {type: Boolean},
        }
    },
    {
        // _id: false,
        timestamp: true,
    }
);

module.exports = mongoose.model('Student', StudentSchema);