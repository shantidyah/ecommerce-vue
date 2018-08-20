const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schemaUser = new Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    address:{
        type: String
    },
    city:{
        type: String
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
},{
    timestamps:
    {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const User = mongoose.model('User', schemaUser)

module.exports = User