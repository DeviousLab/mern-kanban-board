const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/board', require('./board'));
router.use('/board/:boardId/section', require('./section'));

module.exports = router;

