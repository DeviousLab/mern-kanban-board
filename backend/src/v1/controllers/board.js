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

exports.updatePosition = async (req, res) => {
  const { boards } = req.body;
  try {
    for (const key in boards.reverse()) {
      const board = boards[key];
      await Board.findByIdAndUpdate(board._id, { $set: { position: key }});
    }
    res.status(200).json('Updated board positions');
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.getOne = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findOne({ _id: boardId, user: req.user._id });
    if(!board) {
      res.status(404).json('Board not found');
    }
    const sections = await Section.find({ board: boardId });
    for (const section of sections) {
      const tasks = await Task.find({ section: section.id }).populate('section').sort('-position');
      section._doc.tasks = tasks;
    }
    board._doc.sections = sections;
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.update = async (req, res) => {
  const { boardId } = req.params;
  const { title, description, favourite } = req.body;
  try {
    if(title === '') req.body.title = 'Untitled';
    if(description === '') req.body.description = 'Add a description';
    const currentBoard = await Board.findById(boardId);
    if(!currentBoard) return res.status(404).json('Board not found');
    if(favourite !== undefined && currentBoard.favourite !== favourite) {
      const favourites = await Board.find({
        user: currentBoard.user,
        favourite: true,
        _id: { $ne: boardId }
      });
      if(favourite) {
        req.body.favouritePosition = favourites.length > 0 ? favourites.length : 0;
      } else {
        for (const key of favourites) {
          const element = favourites[key];
          await Board.findByIdAndUpdate(element.id, { $set: { favouritePosition: key }});
        }
      }
    }
    const board = await Board.findByIdAndUpdate(boardId, { $set: req.body });
    res.status(200).json(board);
  } catch (error) {
    console.log(error);
  }
}