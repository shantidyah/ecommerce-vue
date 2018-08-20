const User = require('../models/users.js')
var jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');

class user {
    static Register( req, res ){
        const saltRounds = 5;
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(req.body.password, salt);
        User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            address: req.body.address,
            city: req.body.city
        })
        .then( user =>{
            const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, process.env.secret_key)
            console.log(user);
            res.json({token})
        })
        .catch( err =>{
            res.json(err)
        })
    }
    static Login( req, res ){
        
        User.findOne({
            email: req.body.email
        })
        .then(user=>{
            if(user){
                var statusPass = bcrypt.compareSync(req.body.password, user.password)
                if(statusPass){
                    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, process.env.secret_key)
                    console.log("berhasil masuk");
                    
                    res.json({token})
                }
                else{
                    res.json('pass salah')
                }
            }
            else{
                res.json('email salah')
            }
        })
    }
    static Verify( req,res ){
        
        var decoded = jwt.verify(req.headers.token, process.env.secret_key)
        console.log("masuk verify");
        // console.log(decoded);
        res.json(decoded)
    }
}

module.exports = user