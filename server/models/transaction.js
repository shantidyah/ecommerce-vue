const mongoose = require('mongoose');
const Schema = mongoose.Schema

const schemaTrans = new Schema({
    email:{
        type: String
    },
    total:{
        type: Number
    }
},{
    timestamps:
    {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
})

const Transaction = mongoose.model('Transaction', schemaTrans)

module.exports = Transaction