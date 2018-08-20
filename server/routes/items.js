var express = require('express');
var router = express.Router();
const { Add, List, Edit, Delete, ListbyCategory, Search } = require('../controllers/product.js')
/* GET users listing. */

router.post('/add', Add)
router.get('/', List)
router.put('/edit/:id', Edit)
router.delete('/delete/:id', Delete)
router.get('/category/:category', ListbyCategory)
router.get('/search', Search)

module.exports = router;
