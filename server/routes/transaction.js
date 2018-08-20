var express = require('express');
var router = express.Router();
const {List, Add} = require('../controllers/transaction')

/* GET users listing. */
router.get('/',List)
router.post('/add',Add)

module.exports = router;
