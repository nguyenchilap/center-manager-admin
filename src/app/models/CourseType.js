const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseType = new Schema({
    name: {type: String, required: true},
}, {
    timestamps: true,
} );

//ADD PLUGIN

module.exports = mongoose.model('CourseType', CourseType);