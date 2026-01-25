const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { add, getAll } = require('../controllers/waterController');

router.post('/', auth, add);
router.get('/', auth, getAll);

module.exports = router;
