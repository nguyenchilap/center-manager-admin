const mongoose = require('mongoose');

async function connect(){
    try{
        await mongoose.connect('mongodb+srv://lap18620:Lapboy20@cluster0.ogmkg.mongodb.net/edu_center_management?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect succesfully!!!');
    }
    catch (error) {
        console.log('Connect failed!!!');
    }
}

module.exports = {connect};