const Transaction = require('../models/transaction.js')

class transaction {
    static List ( req, res ){
        Transaction.find({})
        .then( trans =>{
            res.json(trans)
        })
        .catch( err => {
            res.json(err)
        })
    }
    static Add( req, res ){
        Transaction.create({
            email: req.body.email,
            total: req.body.total
        })
        .then( trans =>{
            res.json( trans )
        })
        .catch( err =>{
            res.json( err )
        })
    }
}

module.exports = transaction