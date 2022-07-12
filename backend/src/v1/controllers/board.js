const Board = require('../models/board');
const Section = require('../models/section');
const Task = require('../models/task');

exports.create = async (req, res) => {
  try {
    const numBoards = await Board.find().count();
    const board = await Board.create({
      user: req.user._id,
      position: numBoards > 0 ? numBoards : 0,
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.getAll = async (req, res) => {
  try {
    const boards = await Board.find({ user: req.user._id }).sort('-position');
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json(error);
  }
}