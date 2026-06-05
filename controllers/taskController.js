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
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
        const skip = (page - 1) * limit;

        const filter = { userId: req.user.id };

        // optional title search (case-insensitive, partial match)
        if (req.query.search) {
            const q = req.query.search.trim();
            if (q.length) {
                filter.title = { $regex: q, $options: "i" };
            }
        }

        const [total, tasks] = await Promise.all([
            Task.countDocuments(filter),
            Task.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        res.json({
            page,
            limit,
            total,
            totalPages,
            data: tasks
        });

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