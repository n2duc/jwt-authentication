import { StatusCodes } from 'http-status-codes'
import Task from '~/models/task.model'

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.jwtDecoded.id })

    res.status(StatusCodes.OK).json(tasks)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const addTask = async (req, res) => {
  try {
    const { title } = req.body
    const user = req.jwtDecoded
    const newTask = new Task({
      userId: user.id,
      title
      // completed: true
    })

    const task = await newTask.save()

    res.status(StatusCodes.CREATED).json(task)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const { completed } = req.body

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: { completed } },
      { new: true }
    )

    res.status(StatusCodes.OK).json({ task })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
}

export const taskController = {
  getTasks,
  addTask,
  updateTask
}