const bcrypt = require('bcryptjs');
const Manager = require('../models/Manager');

class AdminRepository{
    newAccount(username, password){
        const hashedPassword = bcrypt.hashSync(password, 10);
        return new Manager({
            account: {
                username: username,
                password: hashedPassword,
            }
        })
    }
}

module.exports = new AdminRepository();