const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/board', require('./board'));

module.exports = router;

