const router = require('express').Router();
const { param } = require('express-validator');
const validation = require('../handlers/validation');
const tokenHandler = require('../handlers/tokenHandler');
const boardController = require('../controllers/board');

router.post('/',
  tokenHandler.verifyToken,
  boardController.create
);

router.get('/',
  tokenHandler.verifyToken,
  boardController.getAll
);

router.put('/',
  tokenHandler.verifyToken,
  boardController.updatePosition
)

router.get('/:boardId',
  param('boardId').custom(value => {
    if(!validation.isObjectId(value)) {
      return Promise.reject('Invalid boardId');
    } else return Promise.resolve();
  }),
  validation.validate,
  tokenHandler.verifyToken,
  boardController.getOne
);

module.exports = router;