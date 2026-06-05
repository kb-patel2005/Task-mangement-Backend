import Task from "../models/Task.js";

export const createTask = async (req, res) => {

    try {

        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            userId: req.user.id
        });

        res.status(201).json(task);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export const getTasks = async (req, res) => {

    try {

        const tasks = await Task.find({
            userId: req.user.id
        });

        res.json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export const updateTask = async (req, res) => {

    try {

        const task =
            await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.title =
            req.body.title || task.title;

        task.description =
            req.body.description ||
            task.description;

        task.status =
            req.body.status || task.status;

        await task.save();

        res.json(task);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteTask = async (req, res) => {

    try {

        await Task.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Task deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};