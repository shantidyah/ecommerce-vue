const Product = require('../models/products.js')

class product {
    static Upload ( req, res ) {
        res.send({
            status: 200,
            message: 'Your file is successfully uploaded',
            link: req.file.cloudStoragePublicUrl,
            file: req.file
          })
    }
    static Add ( req, res ) {
        Product.create({
            type: req.body.type,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            discount: req.body.discount,
            url: req.body.url 
        })
        .then(newPro => {
            res.json(newPro)
        })
        .catch( err => {
            res.json(err)
        })
    }
    static List ( req, res ) {
        Product.find({})
        .then(products=>{
            // console.log(products);
            res.json(products)
        })
        .catch(err=>{
            console.log(err);
            res.json(err)
        })
    }
    static Edit ( req, res ) {
        Product.findByIdAndUpdate( req.params.id, {
            type: req.body.type,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            discount: req.body.discount,
            url: req.body.url
        })
        .then( product => {
            res.json( product )
        })
        .catch( err =>{
            res.json( err )
        })
    }
    static Delete( req, res ){
        Product.findByIdAndRemove( req.params.id )
        .then( result =>{
            res.json( result )
        })
        .catch( err =>{
            res.json( err )
        })
    }
    static ListbyCategory( req, res ){
        Product.find({
            category : req.params.category
        })
        .then(products=>{
            // console.log(products);
            res.json(products)
        })
        .catch(err=>{
            console.log(err);
            res.json(err)
        })
    }
    static Search( req, res ){
        Product.find({$or: [
            {category: new RegExp(req.query.q, 'i')},
            {type: new RegExp(req.query.q, 'i')},
            {brand: new RegExp(req.query.q, 'i')}
        ]})
        .then( product =>{
            res.json(product)
        })
        .catch( err =>{
            res.json(err)
        })

    }
}


module.exports = product