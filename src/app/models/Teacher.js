const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema(
    {
        name: {type: String, maxlength: 50},
        major: {type: String},
        birth: {type: String},
        phone: {type: String, maxlength: 20},
        email: {type: String, maxlength: 50},
        img: {type: String, default: 'none'},
        createAt: {type: Date, default: Date.now},
        courses : {
            courseId: {type: Schema.Types.ObjectId},
            assignBy: {type: String},
            assignedAt: {type: Date, default: Date.now},
        }
    },
    {
        timestamp: true,
    }
);

module.exports = mongoose.model('Teacher', TeacherSchema);