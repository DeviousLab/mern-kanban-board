const Task = require('../models/task');
const Section = require('../models/section');

exports.create = async (req, res) => {
  const { sectionId } = req.body;
  try {
    const section = await Section.findById(sectionId);
    const tasksCount = await Task.find({ section: sectionId }).count()
    const task = await Task.create({
      section: sectionId,
      position: tasksCount > 0 ? tasksCount : 0
    });
    task._doc.section = section;
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.update = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findByIdAndUpdate(taskId, { $set: req.body });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.delete = async (req, res) => {
  const { taskId } = req.params;
  try {
    const currentTask = await Task.findById(taskId);
    await Task.deleteOne({ _id: taskId });
    const tasks = await Task.find({ section: currentTask.section }).sort('position');
    for (const key in tasks) {
      await Task.findByIdAndUpdate(tasks[key]._id, { $set: { position: key } });
    }
    res.status(200).json('Task deleted');
  } catch (error) {
    res.status(500).json(error);
  }
}

exports.updatePosition = async (req, res) => {
  const { resourceList, destinationList, resourceSectionId, destinationSectionId } = req.body;
  const resourceListReversed = resourceList.reverse();
  const destinationListReversed = destinationList.reverse();
  try {
    if (resourceSectionId !== destinationSectionId) {
      for (const key in resourceListReversed) {
        await Task.findByIdAndUpdate(resourceListReversed[key].id, { $set: { section: resourceSectionId, position: key } });
      }
    }
    for (const key in destinationListReversed) {
      await Task.findByIdAndUpdate(destinationListReversed[key].id, { $set: { section: destinationSectionId, position: key } });
    }
    res.status(200).json('Tasks moved');
  } catch (error) {
    res.status(500).json(error);
  }
}